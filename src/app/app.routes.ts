import {Routes} from '@angular/router';

export const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch: "full"},
  {path: "home", loadComponent: () => import("../components/home/home.component"), title: "Home"},
  {path: "about-us", loadComponent: () => import("../components/about-us/about-us.component"), title: "About"}
];
