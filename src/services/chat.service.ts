import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private stompClient: Client;
  private username!: string;

  constructor() {
    this.stompClient = over(new SockJS('http://localhost:8080/ws'));
  }

  connect(username: string) {
    this.username = username;
    this.stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);

      // Subscribe to personal messages
      this.stompClient.subscribe(`/user/${this.username}/queue/messages`, (message: Message) => {
        console.log('Received: ' + message.body);
      });

      // Subscribe to group messages (assume user is part of multiple groups)
      const groups = ['group1', 'group2']; // Replace with actual groups
      groups.forEach(group => {
        this.stompClient.subscribe(`/topic/groups/${group}`, (message: Message) => {
          console.log(`Received in group ${group}: ` + message.body);
        });
      });
    });
  }

  sendMessage(to: string, content: string, isGroup: boolean = false) {
    const message = { from: this.username, to: isGroup ? `group:${to}` : to, content: content };
    this.stompClient.send('/app/send', {}, JSON.stringify(message));
  }
}
