import {inject, Injectable} from '@angular/core';
import {map} from "rxjs";
import {RxStompService} from "@stomp/ng2-stompjs";
import {RxStompConfig} from "@stomp/rx-stomp";
import {Mess} from "../models/model";
import { HttpClient } from '@angular/common/http';
import { MESSAGE_API } from '../data/const';

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
  private username!: string;
  private groups!: string[];

  constructor() {
    this.rxStompService.configure(rxStompConfig);
    this.rxStompService.activate();
  }

  init() {
    // Subscribe to group messages (assume user is part of multiple groups)
    // Replace with actual groups
    if (this.groups === undefined || this.groups.length < 1) {
      console.log("The user " + this.username + " has no groups");
      return;
    }

    this.groups.forEach((group) => {
      this.rxStompService.watch(`/topic/groups/${group}`).pipe(
        map((message) => message.body)
      ).subscribe((messageBody) => {
        console.log(`Received in group ${group}: ` + messageBody);
      });
    });
  }

  setWebSocketCredentials(username: string, groups: string[]) {
    this.username = username;
    this.groups = groups;
  }

  sendMessage(recipient: string, content: string, isGroup: boolean = false) {
    const message: Mess = {
      id: 0,
      sender: this.username,
      recipient: isGroup ? `group:${recipient}` : recipient,
      content: content,
      date : new Date()
    };
    this.rxStompService.publish({destination: '/app/send', body: JSON.stringify(message)});
  }

  watchMessages() {
    // Subscribe to personal messages
    return this.rxStompService.watch(`/queue/${this.username}`);
  }

  getHistoryBetweenTwoUser(from : string, to : string){
    return this.httpClient.post<Mess[]>(MESSAGE_API+"/getHistoryBetweenTwoUser" , {from,to})
  }
}
