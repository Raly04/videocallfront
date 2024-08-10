import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Button } from "primeng/button";
import { FileSelectEvent, FileUploadEvent, FileUploadModule } from "primeng/fileupload";
import { MessageModule } from "primeng/message";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { UserService } from "../../services/user.service";
import { ActivatedRoute } from "@angular/router";
import { User } from "../../models/model";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  destroyRef = inject(DestroyRef);

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
    console.log(event.files[0]);
    this.userService.uploadAvatar(this.currentUserId(), event.files[0])
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (res) => {
        this.loadUserAvatar();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Avatar uploaded successfully' })
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Avatar upload failed' });
      }
    });
  }

  loadUserAvatar(): void {
    this.userService.getUserAvatar(this.currentUserId())
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(blob => {
      const objectURL = URL.createObjectURL(blob);
      this.currentUserAvatarUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      console.log("Uploaded avatar");
    });
  }
}
