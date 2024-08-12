import { Component, DestroyRef, inject } from '@angular/core';
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TabViewModule } from "primeng/tabview";
import { UserService } from "../../services/user.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ListboxModule } from "primeng/listbox";
import { FormsModule } from "@angular/forms";
import { User } from "../../models/model";
import { AsyncPipe, NgOptimizedImage } from "@angular/common";
import { Router } from "@angular/router";
import { BadgeModule } from "primeng/badge";
import { UserInfoService } from "../../services/user-info.service";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TabViewModule,
    ListboxModule,
    FormsModule,
    AsyncPipe,
    NgOptimizedImage,
    BadgeModule,
    ButtonModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(Router);
  userInfoService = inject(UserInfoService);
  sanitizer = inject(DomSanitizer);

  contacts!: User[];
  allUsers!: User[];
  selectedUser!: User;
  currentUserAvatarUrl !: SafeUrl;

  constructor() {
    this.getAllUsers();
    this.loadUserAvatar();
  }

  getAllUsers() {
    this.userService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.allUsers = res.filter(user => user.username !== this.userInfoService.currentUser.username);
      }
      )

    this.userService.getContacts(this.userInfoService.currentUser.id)
      .subscribe(res => {
        this.contacts = res;
      })
  }

  openUserChat() {
    this.route.navigateByUrl("/index/message/" + this.selectedUser.id).then();
  }

  openUserAccount() {
    this.route.navigateByUrl("/index/account/" + this.userInfoService.currentUser.id).then();
  }

  loadUserAvatar(): void {
    this.userService.getUserAvatar(this.userInfoService.currentUser.id).subscribe(blob => {
      const objectURL = URL.createObjectURL(blob);
      this.currentUserAvatarUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    });
  }

  sendFriendRequest(id: number) {
    
  }
}
