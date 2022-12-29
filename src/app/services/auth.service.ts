import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Profile} from "../models/profile";
import {environment} from "../../environments/environments";

declare let gapi : any

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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
        apiKey: environment.API_KEY,
        clientId: environment.CLIENT_ID,
        discoveryDocs: environment.DISCOVERY_DOCS,
        scope: environment.SCOPE,
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

    this.profile = {
      id: googleProfile.getId(),
      firstName: googleProfile.getGivenName(),
      lastName: googleProfile.getFamilyName(),
      image: googleProfile.getImageUrl(),
      email: googleProfile.getEmail()
    }
  }
}
