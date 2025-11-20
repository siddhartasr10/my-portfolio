import { Routes } from '@angular/router';
import { AboutMeComponent } from './views/about-me/about-me.component';
import { ProjectsComponent } from './views/projects/projects.component';


export const routes: Routes = [
  { path: "", component: AboutMeComponent },
  { path: "proyectos", component: ProjectsComponent },
  { path: "**", redirectTo: "/", pathMatch: "full" }
];
