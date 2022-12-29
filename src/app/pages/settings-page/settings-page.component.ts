import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Color, COLORS} from "../../models/colors";
import {Category} from "../../models/category";

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {

  sleepRangeMessage: string = ' '
  categoriesMessage: string = ' '
  categories: Map<string | undefined, string> = new Map<string | undefined, string>()

  sleepRangeForm = new FormGroup({
    timeFrom: new FormControl(localStorage.getItem('timeFrom')),
    timeTo: new FormControl(localStorage.getItem('timeTo')),
  });

  ngOnInit(): void {
    for (let [id, color] of COLORS.entries()) {
      let value = localStorage.getItem('color_' + id)
      this.categories.set(id, value ? value : '')
    }
  }

  isValidTime(from : string, to : string) : boolean {
    let regular = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/
    let isValidFrom = regular.test(from);
    let isValidTo = regular.test(to);

    if (!isValidFrom)
      this.sleepRangeForm.get('timeFrom')?.setValue('')

    if (!isValidTo)
      this.sleepRangeForm.get('timeTo')?.setValue('')

    return isValidFrom && isValidTo
  }

  saveSleepRangeForm() {
    let value = this.sleepRangeForm.value
    let from = value.timeFrom, to = value.timeTo

    if (from && to && this.isValidTime(from, to)) {
      localStorage.setItem('timeFrom', from)
      localStorage.setItem('timeTo', to)

      this.sleepRangeMessage = 'Sleep time updated successfully'
      setTimeout(() => this.sleepRangeMessage = '', 5000)
    }
  }

  saveCategoriesForm(event: Category) {
    localStorage.setItem('color_' + event.color, event.name)

    this.categoriesMessage = 'Category mapping update successfully'
    setTimeout(() => this.categoriesMessage = '', 5000)
  }

  getColor(colorId: string | undefined): string | undefined {
    return COLORS.get(colorId)?.name
  }

  getCategory(colorId: string | undefined) {
    return this.categories.get(colorId)
  }

  colorInfo(colorId: string | undefined): Color | undefined {
    return COLORS.get(colorId)
  }

  colorStyle(colorId: string | undefined): string {
    let color = this.colorInfo(colorId ? colorId : undefined)
    return "background-color: " + color?.color
  }
}
