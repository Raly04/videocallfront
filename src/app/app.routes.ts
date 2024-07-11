import { Routes } from '@angular/router';

export const routes: Routes = [
  {path : "home" , loadComponent : () => import("../components/home/home.component"),title:"Home"},
  {path : "home" , loadComponent : () => import("../components/about-us/about-us.component"),title:"About"}
];
