import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  isAuthenticated = false
  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth
    })
  }

  getFullName() : string {
    return this.authService.profile?.firstName + ' ' + this.authService.profile?.lastName
  }
}
