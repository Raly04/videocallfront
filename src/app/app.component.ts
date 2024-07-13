import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatIcon} from "@angular/material/icon";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIconButton, MatMenuTrigger, MatIcon, AsyncPipe, MatMenu, MatMenuItem, MatButton, MatFabButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
