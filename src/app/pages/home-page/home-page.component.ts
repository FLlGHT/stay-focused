import {Component, NgZone, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Stats} from "../../models/stats";
import {Color, COLORS} from "../../models/colors";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  events : Map<string, number> | undefined
  categories: Map<string, number> | undefined
  stats : Stats | undefined = undefined
  SLEEP_TIME_RATIO = 0.333

  settingsForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
    endControl: new FormControl()
  });

  constructor(public authService: AuthService, private zone: NgZone) {

  }
  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth)
        this.loadEvents(this.atStartOfDay(new Date()), this.atEndOfDay(new Date()))
      else
        this.clearView()
    })
  }

  clearView() {
    this.events = undefined
    this.categories = undefined
  }

  atStartOfDay(date: Date) : Date {
    let start = new Date(date)
    start.setHours(0, 0, 0, 0)
    return start
  }

  atEndOfDay(date: Date) : Date {
    let end = new Date(date)
    end.setHours(23, 59, 59, 999)
    return end
  }

  duration(from: Date, to: Date) : number {
    let difference = new Date(to).getTime() - new Date(from).getTime()
    return Math.round(difference / 60000)
  }

  loadEvents(from: Date, to: Date) {
    this.authService.getGapi().client.calendar.events
      .list({
        calendarId: 'primary',
        timeMin: from.toISOString(),
        timeMax: to.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      })
      .then((response: any) => {
        this.updateEvents(response, from, to)
      });
  }

  updateEvents(response: any, from : Date, to: Date) {
    this.zone.run(() => {
      const events = response.result.items;
      let eventMap = new Map(), categoryMap = new Map()

      for (const event of events) {
        let color = event.colorId
        let name = event.summary;
        let duration = this.duration(event.start.dateTime, event.end.dateTime)

        let eventTotal = eventMap.get(name) ? eventMap.get(name) : 0
        eventMap.set(name, eventTotal + duration)

        let categoryTotal = categoryMap.get(color) ? categoryMap.get(color) : 0
        categoryMap.set(color, categoryTotal + duration)
      }

      this.events = new Map([...eventMap.entries()].sort((firstEntry, secondEntry) => secondEntry[1] - firstEntry[1]))
      this.categories = new Map([...categoryMap.entries()].sort((firstEntry, secondEntry) => secondEntry[1] - firstEntry[1]))
      this.updateStats(from, to)
    });
  }

  updateStats(from: Date, to: Date) {
    let productiveTime = 0

    if (this.events) {
      for (let [name, time] of this.events.entries()) {
        productiveTime += time
      }
    }

    console.log('from' + from + ' to' + to)
    let totalTime = Math.floor(this.duration(from, to) * (1 - this.SLEEP_TIME_RATIO))
    this.stats = {totalTime: totalTime, productiveTime: productiveTime, percentage: productiveTime / totalTime}
  }

  onSubmit() {
    let settings = this.settingsForm.value
    let endType = settings.endControl

    let from = this.atStartOfDay(settings.startDate ? settings.startDate : new Date())
    let to = this.atEndOfDay(settings.endDate ? settings.endDate : new Date())

    if (this.isEndSettingsVisible() && endType && endType === 'currently')
      to.setTime(new Date().getTime())

    this.loadEvents(from, to)
  }

  withoutComparison() {
    return 0
  }

  colorInfo(colorId: string) : Color | undefined {
    return COLORS.get(colorId)
  }

  colorStyle(colorId: string) : string {
    let color = this.colorInfo(colorId)
    return "background-color: " + color?.color
  }

  isEndSettingsVisible() : boolean {
    let value = this.settingsForm.value.endDate
    return (value && new Date(value).toDateString() === new Date().toDateString())
  }

  visibilityStyle() {
    return {'visibility' : this.isEndSettingsVisible() ? 'visible' : 'hidden'}
  }

}
