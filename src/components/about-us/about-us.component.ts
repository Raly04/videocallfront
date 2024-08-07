import { Component } from '@angular/core';
import {NavBarComponent} from "../nav-bar/nav-bar.component";

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    NavBarComponent
  ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export default class AboutUsComponent {

}
