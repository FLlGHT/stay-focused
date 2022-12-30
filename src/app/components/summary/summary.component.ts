import {Component, Input} from '@angular/core';
import {Stats} from "../../models/stats";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent {

  @Input() stats : Stats | undefined

  toHoursAndMinutes(totalMinutes: number) {
    let hours = Math.floor(totalMinutes / 60)
    let minutes = (totalMinutes - hours * 60)
    return this.toHours(hours) + this.toMinutes(minutes)
  }

  toHours(hours: number) : string {
    return hours > 0 ? (hours + ' h ') : ''
  }

  toMinutes(minutes: number) : string {
    return minutes > 0 ? minutes + ' min' : ''
  }

}
