import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Range} from "../../models/range";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  @Output() submit: EventEmitter<Range> = new EventEmitter<Range>()

  settingsForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
    endControl: new FormControl()
  });

  isEndSettingsVisible() : boolean {
    let value = this.settingsForm.value.endDate
    return (value && new Date(value).toDateString() === new Date().toDateString())
  }

  visibilityStyle() {
    return {'visibility' : this.isEndSettingsVisible() ? 'visible' : 'hidden'}
  }

  onSubmit() {
    let settings = this.settingsForm.value
    let endType = settings.endControl

    let from = this.atStartOfDay(settings.startDate ? settings.startDate : new Date())
    let to = this.atEndOfDay(settings.endDate ? settings.endDate : new Date())

    let sleepFrom = localStorage.getItem('sleepFrom')
    let sleepTo = localStorage.getItem('sleepTo')

    if (this.isEndSettingsVisible() && endType && endType === 'currently') {
      to.setTime(new Date().getTime())

      if (new Date(from).toDateString() === new Date().toDateString() && sleepTo) {
        from.setHours(parseInt(sleepTo.slice(0, sleepTo.indexOf(':'))))
        from.setMinutes(parseInt(sleepTo.slice(sleepTo.indexOf(':') + 1)))
      }
    }

    let range : Range = {from: from, to: to}
    console.log(range)
    this.submit.emit(range)
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
}
