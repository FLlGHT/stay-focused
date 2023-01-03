import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {SettingsPageComponent} from "./pages/settings-page/settings-page.component";

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'STAYFOCUSED', component: HomePageComponent},
  {path: 'settings', component: SettingsPageComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
