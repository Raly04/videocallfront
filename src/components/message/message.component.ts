import { DatePipe } from "@angular/common";
import { Component, DestroyRef, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from "@angular/router";
import { AvatarModule } from "primeng/avatar";
import { Button } from "primeng/button";
import { ChipModule } from "primeng/chip";
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from "primeng/inputtext";
import { map } from "rxjs";
import { userToContact } from '../../models/mapper';
import { Contact, Mess, MessageType, User } from "../../models/model";
import { ChatService } from "../../services/chat.service";
import { UserInfoService } from "../../services/user-info.service";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    AvatarModule,
    Button,
    InputTextModule,
    InputIconModule,
    ChipModule,
    DatePipe,
    FormsModule
  ],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export default class MessageComponent {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  message: string = "";
  conversations = signal<Mess[]>([]);
  currentUserInfo!: User;
  receiverUserInfo = signal<User | null>(null);
  receiverUserId = signal<number | null>(null);

  userService = inject(UserService);
  userInfoService = inject(UserInfoService);
  activatedRoute = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  chatService = inject(ChatService);
  contactAvatarUrl !: SafeUrl;
  sanitizer = inject(DomSanitizer);

  constructor() {
    this.currentUserInfo = this.userInfoService.currentUser;
    // Subscribe to route parameter changes
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const id = +params['id'];
        this.receiverUserId.set(id);
      });

    // React to changes in receiverUserId
    effect(() => {
      const userId = this.receiverUserId();
      if (userId !== null) {
        this.getUserInfo(userId);
      }
    });

    //Define websocket credentials
    this.chatService.setWebSocketCredentials(
      this.userInfoService.currentUser,
      this.userInfoService.currentUser.groups
    );

    //Start and watch on sockets
    this.chatService.watchMessages()
      .pipe(map((message) => message.body))
      .subscribe((messageBody) => {
        console.log('Received: ' + messageBody);
        let receivedMessage = JSON.parse(messageBody) as Mess;
        if (receivedMessage.senderId == this.receiverUserInfo()?.id && receivedMessage.content.trim()) {
          this.conversations.update(conversations => [
            ...conversations,
            receivedMessage
          ]);
          setTimeout(() => this.scrollToBottom(), 100); // Scroll after DOM update
        }
      });
  }

  getUserInfo(id: number) {
    this.userService.findById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.receiverUserInfo.set(res);
        this.chatService.getHistoryBetweenTwoUser(this.currentUserInfo.username, this.receiverUserInfo()?.username as string)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((res) => {
            console.log("HISTORY",res)
            this.conversations.set(res);
            res.forEach((message) => {
              console.log("MESSAGE",message.senderId)
            });
            setTimeout(() => this.scrollToBottom(), 100);
          })
          this.loadAvatar(userToContact(res));
      });
  }

  loadAvatar(contact: Contact): void {
    if (!contact.isGroup) {
      this.userService
        .getUserAvatar(contact.id) // Use contact.id instead of currentUser.id
        .subscribe((blob) => {
          const objectURL = URL.createObjectURL(blob);
          this.contactAvatarUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        });
    }
  }

  private scrollToBottom(): void {
    try {
      const container = this.messageContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {}
  }

  send() {
    if (this.receiverUserInfo() && this.message.trim()) {
      this.conversations.update(conversations => [
        ...conversations,
        {
          id: 0,
          senderId: this.currentUserInfo.id,
          receiverId: this.receiverUserInfo()!.id,
          content: this.message.trim(),
          type : MessageType.USER,
          date : new Date(),
        }
      ]);
      if(this.receiverUserInfo()){
        this.chatService.sendMessageToUser(this.receiverUserInfo() as User, this.message.trim());
      }
      this.message = "";
      setTimeout(() => this.scrollToBottom(), 100); // Scroll after DOM update
    }
  }
}
