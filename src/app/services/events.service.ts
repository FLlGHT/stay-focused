import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(private authService: AuthService) {

  }
}
