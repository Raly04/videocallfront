import {Component, DestroyRef, inject} from '@angular/core';
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {TabViewModule} from "primeng/tabview";
import {UserService} from "../../services/user.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ListboxModule} from "primeng/listbox";
import {FormsModule} from "@angular/forms";
import {User} from "../../models/model";
import {Observable, tap} from "rxjs";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";
import {stringify} from "node:querystring";
import {BadgeModule} from "primeng/badge";
import {UserInfoService} from "../../services/user-info.service";

@Component({
  selector: 'app-side-bar',
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
    BadgeModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  private readonly userService = inject(UserService);
  private readonly  destroyRef = inject(DestroyRef);
  private readonly route = inject(Router);
  userInfoService = inject(UserInfoService);

  contacts!: User[];
  selectedUser!: User;

  constructor() {
    this.getAllUsers()
  }

  getAllUsers(){
    this.userService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res=>{
        this.contacts = res.filter(user => user.username !==  this.userInfoService.currentUser.username);
      }
    )
  }

  openUserChat() {
    this.route.navigateByUrl("/index/message/"+this.selectedUser.id).then();
  }

  openUserAccount(userId : number) {
    this.route.navigateByUrl("/index/account/4").then();
  }
}
