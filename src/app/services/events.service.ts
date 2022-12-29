import {Injectable, Input} from '@angular/core';
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private authService: AuthService) {
  }

  getEvents(from: Date, to: Date) : Promise<any> {
    return this.authService.getGapi().client.calendar.events
      .list({
        calendarId: 'primary',
        timeMin: from.toISOString(),
        timeMax: to.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      })
  }
}
