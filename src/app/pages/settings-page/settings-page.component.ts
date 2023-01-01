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
    sleepFrom: new FormControl(localStorage.getItem('sleepFrom')),
    sleepTo: new FormControl(localStorage.getItem('sleepTo')),
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
      this.sleepRangeForm.get('sleepFrom')?.setValue('')

    if (!isValidTo)
      this.sleepRangeForm.get('sleepTo')?.setValue('')

    return isValidFrom && isValidTo
  }

  saveSleepRangeForm() {
    let value = this.sleepRangeForm.value
    let from = value.sleepFrom, to = value.sleepTo

    if (from && to && this.isValidTime(from, to)) {
      localStorage.setItem('sleepFrom', from)
      localStorage.setItem('sleepTo', to)

      this.sleepRangeMessage = 'Sleep time updated successfully'
      setTimeout(() => this.sleepRangeMessage = '', 5000)
    }
  }

  saveCategoryTitle(category: Category) {
    localStorage.setItem('color_' + category.color, category.name)

    this.categoriesMessage = 'Category title update successfully'
    setTimeout(() => this.categoriesMessage = '', 5000)
  }

  saveCategoryStatus(category: string | undefined, isActive: any) {
    let disabled = JSON.parse(localStorage.getItem('disabled') || '[]')

    if (isActive)
      disabled = this.removeElement(disabled, category)
    else
      disabled.push(category)

    this.categoriesMessage = 'Category status update successfully'
    setTimeout(() => this.categoriesMessage = '', 5000)

    localStorage.setItem('disabled', JSON.stringify(disabled))
  }

  removeElement(disabled: any, toDelete: string | undefined) {
    return disabled.filter((element: string | undefined) => element != toDelete)
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

  isActive(category: string | undefined): boolean {
    let disabled = JSON.parse(localStorage.getItem('disabled') || '[]')
    return !disabled.includes(category)
  }
}
