import { Component, DestroyRef, inject, signal } from "@angular/core";
import { UserInfoService } from "../../services/user-info.service";
import { NotificationService } from "../../services/notification.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Notif, User } from "../../models/model";
import { DatePipe } from "@angular/common";
import { UserService } from "../../services/user.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "app-notification",
  standalone: true,
  imports: [DatePipe],
  templateUrl: "./notification.component.html",
  styleUrl: "./notification.component.scss",
})
export default class NotificationComponent {
  private readonly userService = inject(UserService);
  userInfoService = inject(UserInfoService);
  currentUserInfo!: User;
  notifService = inject(NotificationService);
  destroyRef = inject(DestroyRef);
  notifs = signal<Notif[]>([]);
  sanitizer = inject(DomSanitizer);
  avatarUrls = new Map<number, SafeUrl>();

  constructor() {
    this.currentUserInfo = this.userInfoService.currentUser;
    console.log("NotificationComponent");
    this.getNotifications();
  }

  loadAvatar(senderId: number): void {
    this.userService.getUserAvatar(senderId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((blob) => {
        const objectURL = URL.createObjectURL(blob);
        this.avatarUrls.set(
          senderId, 
          this.sanitizer.bypassSecurityTrustUrl(objectURL)
        );
      });
  }

  addContact(senderId : number) {
    this.userService.addContact(this.currentUserInfo.id , senderId)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((res)=>{
      console.log(res)
    });
  }

  getNotifications() {
    this.notifService
      .getNotifs(this.currentUserInfo.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.notifs.set(res);
        console.log(res);
        res.forEach(notif => {
          this.loadAvatar(notif.sender.id);
        });
      });
  }
}
