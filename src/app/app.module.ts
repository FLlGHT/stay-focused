import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SettingsComponent } from './components/settings/settings.component';
import { SummaryComponent } from './components/summary/summary.component';
import { EventComponent } from './components/event/event.component';
import { CategoryComponent } from './components/category/category.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomePageComponent,
    SettingsComponent,
    SummaryComponent,
    EventComponent,
    CategoryComponent,
    SettingsPageComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
