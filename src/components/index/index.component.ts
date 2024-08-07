import {Component, inject} from '@angular/core';
import {SideBarComponent} from "../side-bar/side-bar.component";
import {RouterOutlet} from "@angular/router";
import {ChatService} from "../../services/chat.service";
import {UserService} from "../../services/user.service";
import {UserInfoService} from "../../services/user-info.service";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    SideBarComponent,
    RouterOutlet
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export default class IndexComponent {

  constructor() {
  }
}
