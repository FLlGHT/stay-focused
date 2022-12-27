import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {Profile} from "../models/profile";

declare let gapi : any

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  CLIENT_ID = '74526733780-olcqqqepah4b98m2ehqsf9tim3p7l1tu.apps.googleusercontent.com'
  API_KEY = 'AIzaSyAxpo3iI7siUajbBa6YZ66y7QsM_s3VpI8'
  DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
  SCOPE = 'https://www.googleapis.com/auth/calendar.readonly'
  isSignedIn = false;

  profile: Profile | undefined


  isAuthenticated$ = new BehaviorSubject<boolean>(false)

  constructor(private zone: NgZone) {
    this.loadGapi().then(() => gapi.load('client:auth2', this.initClient.bind(this)));
  }

  initClient() {
    const updateSignInStatus = this.updateSignInStatus.bind(this);
    gapi.client
      .init({
        apiKey: this.API_KEY,
        clientId: this.CLIENT_ID,
        discoveryDocs: this.DISCOVERY_DOCS,
        scope: this.SCOPE,
        plugin_name: 'sf app'
      })
      .then(() => {
        this.zone.run(() => {
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
          updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          this.updateUserInfo();
        });
      });
  }

  updateSignInStatus(isSignedIn : boolean) {
    console.log('updateSignInStatus', isSignedIn);
    this.isSignedIn = isSignedIn;
    this.isAuthenticated$.next(isSignedIn)
  }

  handleAuth() {
    gapi.auth2.getAuthInstance().signIn();
  }

  handleSignOut() {
    gapi.auth2.getAuthInstance().signOut();
    this.isAuthenticated$.next(false)
  }


  loadGapi() {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    window.document.body.appendChild(script);
    return new Promise<void>((resolve, reject) => {
      script.addEventListener('error', (error) => reject(error));
      script.addEventListener('load', () => resolve());
    });
  }

  getGapi() {
    return gapi
  }

  updateUserInfo() {
    let googleProfile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();

    let profile : Profile = {
      id : googleProfile.getId(),
      firstName : googleProfile.getGivenName(),
      lastName : googleProfile.getFamilyName(),
      image: googleProfile.getImageUrl(),
      email: googleProfile.getEmail()
    }

    this.profile = profile
  }
}
