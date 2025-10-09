import { Routes } from '@angular/router';
import { AboutMeComponent } from './views/about-me/about-me.component';


export const routes: Routes = [
  { path: "", component: AboutMeComponent },
  { path: "**", redirectTo: "/", pathMatch: "full" }
];
