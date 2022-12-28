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

  SLEEP_TIME_RATIO = 0.33

  dateForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl()
  });

  constructor(public authService: AuthService, private zone: NgZone) {

  }
  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth)
        this.loadEvents(new Date(), new Date())
      else
        this.events = undefined
    })
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
        timeMin: this.atStartOfDay(from).toISOString(),
        timeMax: this.atEndOfDay(to).toISOString(),
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
        let color : Color | undefined = COLORS.get(event.colorId)
        let name = event.summary;
        let duration = this.duration(event.start.dateTime, event.end.dateTime)

        let eventTotal = eventMap.get(name) ? eventMap.get(name) : 0
        eventMap.set(name, eventTotal + duration)

        let categoryTotal = categoryMap.get(color?.name) ? categoryMap.get(color?.name) : 0
        categoryMap.set(color?.name, categoryTotal + duration)
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

    let totalTime = Math.floor(this.duration(this.atStartOfDay(from), this.atEndOfDay(to)) * (1 - this.SLEEP_TIME_RATIO))
    this.stats = {totalTime: totalTime, productiveTime: productiveTime, percentage: productiveTime / totalTime}
  }

  onSubmit() {
    let value = this.dateForm.value
    let from = value.startDate
    let to = value.endDate ? value.endDate : new Date()
    this.events = undefined

    this.loadEvents(from, to)
  }

  withoutComparison() {
    return 0
  }
}
