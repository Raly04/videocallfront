import { Component, inject, signal } from '@angular/core';
import { Button } from "primeng/button";
import { FileSelectEvent, FileUploadModule } from "primeng/fileupload";
import { MessageModule } from "primeng/message";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { UserService } from "../../services/user.service";
import { ActivatedRoute } from "@angular/router";
import { User } from "../../models/model";
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    Button,
    FileUploadModule,
    MessageModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export default class AccountComponent {
  isUpdateFinished: boolean = false;
  userInfo !: User;
  currentUserAvatarUrl !: SafeUrl;
  readonly currentUserId = signal<number>(0);

  messageService = inject(MessageService);
  userService = inject(UserService);
  activatedRoute = inject(ActivatedRoute);
  sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.params['id'];
    this.getUserInfo(userId);
    this.currentUserId.set(userId);
    this.loadUserAvatar()
  }

  getUserInfo(id: number) {
    this.userService.findById(id).subscribe(res => {
      this.userInfo = res;
      console.log(this.userInfo);
    })
  }

  upload(event: FileSelectEvent) {
    this.messageService.add({ severity: "secondary", detail: "Hello" });
    console.log(event.files[0])
    this.userService.uploadAvatar(this.currentUserId(), event.files[0]).subscribe(res => {
      console.log(res);
    })
  }

  loadUserAvatar(): void {
    this.userService.getUserAvatar(this.currentUserId()).subscribe(blob => {
      const objectURL = URL.createObjectURL(blob);
      this.currentUserAvatarUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    });
  }
}
