import {Component, NgZone, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Stats} from "../../models/stats";
import {EventsService} from "../../services/events.service";
import {Event} from "../../models/event";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  events: Map<string, Event> | undefined
  categories: Map<string, number> | undefined
  stats: Stats | undefined = undefined

  constructor(public authService: AuthService, private eventsService: EventsService, private zone: NgZone) {
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

  atStartOfDay(date: Date): Date {
    let start = new Date(date)
    start.setHours(0, 0, 0, 0)
    return start
  }

  atEndOfDay(date: Date): Date {
    let end = new Date(date)
    end.setHours(23, 59, 59, 999)
    return end
  }

  duration(from: Date, to: Date): number {
    let difference = new Date(to).getTime() - new Date(from).getTime()
    return Math.round(difference / 60000)
  }

  loadEvents(from: Date, to: Date) {
    this.eventsService.getEvents(from, to)
      .then((response: any) => {
        this.updateEvents(response, from, to)
      });
  }

  updateEvents(response: any, from: Date, to: Date) {
    this.zone.run(() => {
      const events = response.result.items;
      let eventMap = new Map(), categoryMap = new Map()

      for (const calendarEvent of events) {
        let color = calendarEvent.colorId
        let name = calendarEvent.summary.trim();
        let duration = this.duration(calendarEvent.start.dateTime, calendarEvent.end.dateTime)

        let event: Event = eventMap.get(name) ? eventMap.get(name) : {color: color, duration: 0}
        event.duration = event.duration + duration
        eventMap.set(name, event)

        let categoryTotal = categoryMap.get(color) ? categoryMap.get(color) : 0
        categoryMap.set(color, categoryTotal + duration)
      }

      console.log(eventMap)

      this.events = new Map([...eventMap.entries()].sort((firstEntry, secondEntry) => secondEntry[1].duration - firstEntry[1].duration))
      this.categories = new Map([...categoryMap.entries()].sort((firstEntry, secondEntry) => secondEntry[1] - firstEntry[1]))
      this.updateStats(from, to)
    });
  }

  updateStats(from: Date, to: Date) {
    let productiveTime = 0

    if (this.events) {
      for (let [name, event] of this.events.entries()) {
        productiveTime += event.duration
      }
    }

    let sleepRatio = 0.333

    let totalTime = this.isCurrently(from, to) ?
      this.duration(from, to) : Math.floor(this.duration(from, to) * (1 - sleepRatio))
    this.stats = {totalTime: totalTime, productiveTime: productiveTime, percentage: productiveTime / totalTime}
  }

  withoutComparison() {
    return 0
  }

  onSettingsSubmit(event: any) {
    if (event.from && event.to)
      this.loadEvents(event.from, event.to)
  }

  isCurrently(from: Date, to: Date): boolean {
    return from.getHours() > 0 && new Date(from).toDateString() === new Date(to).toDateString()
  }
}
