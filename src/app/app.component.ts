import {Component, NgZone, OnInit} from '@angular/core';

declare let gapi : any


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  CLIENT_ID = '74526733780-olcqqqepah4b98m2ehqsf9tim3p7l1tu.apps.googleusercontent.com'
  API_KEY = 'AIzaSyAxpo3iI7siUajbBa6YZ66y7QsM_s3VpI8'
  DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
  SCOPE = 'https://www.googleapis.com/auth/calendar.readonly'

  isSignedIn = false;
  events = '';

  constructor(private zone: NgZone) {}

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
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
          // Handle the initial sign-in state.
          updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
      });
  }

  updateSignInStatus(isSignedIn : boolean) {
    console.log('updateSignInStatus', isSignedIn);
    this.isSignedIn = isSignedIn;

    if (isSignedIn)
      this.listUpcomingEvents();
  }

  handleAuth() {
    gapi.auth2.getAuthInstance().signIn();
  }

  handleSignOut() {
    gapi.auth2.getAuthInstance().signOut();
    this.isSignedIn = false
    this.events = ''
  }

  listUpcomingEvents() {
    const appendEvent = this.appendEvent.bind(this);
    gapi.client.calendar.events
      .list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      })
      .then((response : any) => {
        this.zone.run(() => {
          const events = response.result.items;
          appendEvent('Upcoming events:');

          for (const event of events)
            appendEvent(event.summary + ' (' + event.start.dateTime + ')');
        });
      });
  }

  appendEvent(text : string) {
    this.events += text + '\n';
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

  async ngOnInit() {
    await this.loadGapi();
    gapi.load('client:auth2', this.initClient.bind(this));
  }
}
