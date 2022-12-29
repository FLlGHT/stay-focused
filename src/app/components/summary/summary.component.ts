import {Component, Input} from '@angular/core';
import {Stats} from "../../models/stats";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent {

  @Input() stats : Stats | undefined

}
