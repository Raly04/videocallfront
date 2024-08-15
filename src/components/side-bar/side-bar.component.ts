import { Component, DestroyRef, inject, signal } from '@angular/core';
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TabViewModule } from "primeng/tabview";
import { UserService } from "../../services/user.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ListboxModule } from "primeng/listbox";
import { FormsModule } from "@angular/forms";
import { Contact, FriendRequestNotif, NotifType, User } from "../../models/model";
import { AsyncPipe, NgOptimizedImage } from "@angular/common";
import { Router } from "@angular/router";
import { BadgeModule } from "primeng/badge";
import { UserInfoService } from "../../services/user-info.service";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { contactToUser, userToContact } from '../../models/mapper';
import { ChatService } from '../../services/chat.service';
import { map } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-side-bar',
  providers: [MessageService],
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
  private readonly chatService = inject(ChatService);
  messageService = inject(MessageService);

  userContacts!: Contact[];
  allContacts!: Contact[];
  selectedContact!: Contact;
  currentAvatarUrl !: SafeUrl;

  notifNumber = signal<number>(0);

  constructor() {
    this.getAllUsers();
    this.loadAvatar(userToContact(this.userInfoService.currentUser));

    //Define websocket credentials
    this.chatService.setWebSocketCredentials(
      this.userInfoService.currentUser,
      this.userInfoService.currentUser.groups
    );


    //Watch on notifications
    this.chatService.watchNotifs()
      .pipe(map((notif) => notif.body))
      .subscribe((notifBody) => {
        console.log('Received: ' + notifBody);
        let receivedNotif = JSON.parse(notifBody) as FriendRequestNotif;
        if (receivedNotif?.sender?.id) {
          this.notifNumber.update(value => value + 1);
        }
      });
  }

  getAllUsers() {
    this.userService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.allContacts = res.map(user => {
          return userToContact(user);
        }).filter(contact => contact.id !== this.userInfoService.currentUser.id);
      }
      )

    this.userService.getContacts(this.userInfoService.currentUser.id)
      .subscribe(res => {
        this.userContacts = res.map(user => {
          return userToContact(user);
        });
      })
  }

  openChat() {
    if (this.selectedContact.isGroup) {
      this.route.navigateByUrl("/index/message/group/" + this.selectedContact.id).then();
    } else {
      this.route.navigateByUrl("/index/message/user/" + this.selectedContact.id).then();
    }
  }

  openUserAccount() {
    this.route.navigateByUrl("/index/account/" + this.userInfoService.currentUser.id).then();
  }

  loadAvatar(contact: Contact): void {
    if (!contact.isGroup) {
      this.userService.getUserAvatar(this.userInfoService.currentUser.id).subscribe(blob => {
        const objectURL = URL.createObjectURL(blob);
        this.currentAvatarUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      });
    }
  }

  sendFriendRequest(contact: Contact) {
    const notif: Partial<FriendRequestNotif> = {
      type: NotifType.FRIEND_REQUEST,
      accepted: false,
      sender: this.userInfoService.currentUser,
      receiver: contactToUser(contact)
    }
    this.chatService.notifyFriendRequest(notif);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'You send a friend request to ' + notif.receiver?.username })
  }
}
