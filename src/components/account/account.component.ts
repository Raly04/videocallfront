import {Component, inject} from '@angular/core';
import {Button} from "primeng/button";
import {FileSelectEvent, FileUploadModule} from "primeng/fileupload";
import {MessageModule} from "primeng/message";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {UserService} from "../../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../models/model";

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

  messageService = inject(MessageService);
  userService = inject(UserService);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.params['id'];
    this.getUserInfo(userId);
  }

  getUserInfo(id : number){
    this.userService.findById(id).subscribe(res=>{
      this.userInfo = res;
      console.log(this.userInfo);
    })
  }

  upload(event: FileSelectEvent) {
    this.messageService.add({severity: "secondary", detail: "Hello"});
    console.log(event.files)
    this.userService.uploadAvatar(event.files[0]).subscribe(res => {
      console.log(res);
    })
  }
}
