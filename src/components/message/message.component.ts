import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { AvatarModule } from "primeng/avatar";
import { Button } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ChipModule } from "primeng/chip";
import { DatePipe } from "@angular/common";
import { UserService } from "../../services/user.service";
import { Mess, User } from "../../models/model";
import { ActivatedRoute } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { UserInfoService } from "../../services/user-info.service";
import { ChatService } from "../../services/chat.service";
import { FormsModule } from "@angular/forms";
import { map } from "rxjs";

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    AvatarModule,
    Button,
    InputTextModule,
    ChipModule,
    DatePipe,
    FormsModule
  ],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export default class MessageComponent {
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
    this.chatService.init();
    this.chatService.watchMessages()
      .pipe(map((message) => message.body))
      .subscribe((messageBody) => {
        console.log('Received: ' + messageBody);
        let receivedMessage = JSON.parse(messageBody) as Mess;
        if (receivedMessage.sender.id === this.receiverUserInfo()?.id && receivedMessage.content.trim()) {
          this.conversations.update(conversations => [
            ...conversations,
            receivedMessage
          ]);
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
          .pipe(
            map(messages => messages.map(message => ({
              ...message,
              date: new Date(message.date)
            })))
          )
          .subscribe((res) => {
            console.log("HISTORY",res)
            this.conversations.set(res);
          })
      });
  }

  send() {
    if (this.receiverUserInfo() && this.message.trim()) {
      this.conversations.update(conversations => [
        ...conversations,
        {
          id: 0,
          sender: this.currentUserInfo,
          receiver: this.receiverUserInfo()!,
          content: this.message.trim(),
          date : new Date(),
        }
      ]);
      if(this.receiverUserInfo()){
        this.chatService.sendMessageToUser(this.receiverUserInfo() as User, this.message.trim());
      }
      this.message = ""; // Clear the message after sending
    }
  }
}
