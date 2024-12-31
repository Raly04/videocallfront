import { Component, DestroyRef, inject, signal } from "@angular/core";
import { UserInfoService } from "../../services/user-info.service";
import { NotificationService } from "../../services/notification.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Notif, User } from "../../models/model";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-notification",
  standalone: true,
  imports: [DatePipe],
  templateUrl: "./notification.component.html",
  styleUrl: "./notification.component.scss",
})
export default class NotificationComponent {
  userInfoService = inject(UserInfoService);
  currentUserInfo!: User;
  notifService = inject(NotificationService);
  destroyRef = inject(DestroyRef);
  notifs = signal<Notif[]>([]);

  constructor() {
    this.currentUserInfo = this.userInfoService.currentUser;
    console.log("NotificationComponent");
    this.getNotifications();
  }

  getNotifications() {
    this.notifService
      .getNotifs(this.currentUserInfo.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.notifs.set(res);
        console.log(res);
      });
  }
}
