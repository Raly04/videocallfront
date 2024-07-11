import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatIcon} from "@angular/material/icon";
import {AsyncPipe} from "@angular/common";
import {ThemeService} from "../services/theme.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIconButton, MatMenuTrigger, MatIcon, AsyncPipe, MatMenu, MatMenuItem, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'material';
  themeManager = inject(ThemeService);
  isDark$ = this.themeManager.isDark$;

  changeTheme(theme: string) {
    this.themeManager.changeTheme(theme);
  }
}
