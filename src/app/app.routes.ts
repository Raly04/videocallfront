import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path : "" ,
    redirectTo : "home" ,
    pathMatch : "full"
  },
  {
    path : "home" ,
    loadComponent : ()=> import("../components/home/home.component") ,
    title : "Home"
  },
  {
    path : "about-us" ,
    loadComponent : ()=> import("../components/about-us/about-us.component") ,
    title : "About us"
  },
  {
    path : "index" ,
    loadComponent: () => import("../components/index/index.component") ,
    title : "Index",
    children : [
      {
        path : "" ,
        redirectTo : "start-discussion" ,
        pathMatch : "full"
      },
      {
        path : "start-discussion",
        title : "start",
        loadComponent : () => import("../components/start-discussion/start-discussion.component")
      },
      {
        path : "account/:id",
        title : "account",
        loadComponent : () => import("../components/account/account.component")
      },
      {
        path : "message",
        title : "Message",
        children : [
          {
            path : "user/:id",
            title : "User",
            loadComponent : () => import("../components/message/message.component")
          },
          {
            path : "group/:id",
            title : "Group",
            loadComponent : () => import("../components/message/message.component")
          },
        ]
      }
    ]
  }
];
