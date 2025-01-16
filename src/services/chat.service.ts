import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RxStompService } from "@stomp/ng2-stompjs";
import { RxStompConfig } from "@stomp/rx-stomp";
import { map } from "rxjs";
import { MESSAGE_API } from '../data/const';
import { FriendRequestNotif, Group, Mess, MessageType, User } from "../models/model";

const rxStompConfig: RxStompConfig = {
  // Which server?
  brokerURL: 'ws://localhost:8080/ws/websocket',

  // Headers
  // Typical keys: login, passcode, host
  connectHeaders: {
    login: 'guest',
    passcode: 'guest'
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 500 (500 milli seconds)
  reconnectDelay: 200,

  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console
  debug: (msg: string): void => {
    console.log(new Date(), msg);
  },
};

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  rxStompService = inject(RxStompService);
  httpClient = inject(HttpClient);
  private user!: User;
  private groups!: Group[];

  constructor() {
    this.rxStompService.configure(rxStompConfig);
    this.rxStompService.activate();
  }

  init() {
    // Subscribe to group messages (assume user is part of multiple groups)
    // Replace with actual groups
    if (this.groups === undefined || this.groups.length < 1) {
      console.log("The user " + this.user.username + " has no groups");
      return;
    }

    this.groups.forEach((group) => {
      this.rxStompService.watch(`/topic/groups/${group.id}`).pipe(
        map((message) => message.body)
      ).subscribe((messageBody) => {
        console.log(`Received in group ${group}: ` + messageBody);
      });
    });
  }

  setWebSocketCredentials(user: User, groups: Group[]) {
    this.user = user;
    this.groups = groups;
  }

  sendMessageToUser(recipient: User, content: string) {
    const message = {
      senderId: this.user.id,
      receiverId: recipient.id,
      content: content,
      type: MessageType.USER,
      date: new Date()
    };
    console.log("MESSAGE : ", message);

    this.rxStompService.publish({ destination: '/app/sendToUser', body: JSON.stringify(message) });
  }

  notifyFriendRequest(notif: Partial<FriendRequestNotif>) {
    this.rxStompService.publish({ destination: '/app/friendRequestNotif', body: JSON.stringify(notif) });
  }

  watchMessages() {
    // Subscribe to personal messages
    return this.rxStompService.watch(`/queue/${this.user.id}`);
  }

  watchNotifs() {
    // Subscribe to notifications
    return this.rxStompService.watch(`/notif/${this.user.id}`);
  }

  getHistoryBetweenTwoUser(from: string, to: string) {
    return this.httpClient.post<Mess[]>(MESSAGE_API + "/getHistoryBetweenTwoUser", { from, to })
  }
}
