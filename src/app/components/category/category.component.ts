import {Component, Input} from '@angular/core';
import {Color, COLORS} from "../../models/colors";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {

  @Input() category: any

  colorInfo(colorId: string) : Color | undefined {
    return COLORS.get(colorId)
  }

  categoryName(colorId: string) : string | undefined {
    let category = localStorage.getItem('color_' + colorId)
    return category ? category : this.colorInfo(colorId)?.name
  }

  colorStyle(colorId: string) : string {
    let color = this.colorInfo(colorId)
    return "background-color: " + color?.color
  }

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
