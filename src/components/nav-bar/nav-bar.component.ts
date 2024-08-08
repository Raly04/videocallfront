import { Component, DestroyRef, inject } from '@angular/core';
import { Button } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { PasswordModule } from "primeng/password";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { User } from "../../models/model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { NgOptimizedImage } from "@angular/common";
import { StorageService } from "../../services/storage.service";
import { UserInfoService } from "../../services/user-info.service";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    Button,
    DialogModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    PasswordModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  // Variables
  isLoginDialogVisible: boolean = false;
  isRegisterDialogVisible: boolean = false;

  //Dependency
  userService = inject(UserService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  storage = inject(StorageService);
  userInfoService = inject(UserInfoService);

  //Form control
  userLoginProfile = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  }
  )

  userRegisterProfile = new FormGroup({
    mail: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  }
  )

  // Methods
  authenticate() {
    const user: User = this.userLoginProfile.value as User;
    this.userService.authenticate(user)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        res => {
          console.log(res)
          if (res.content.length === 2) {
            this.router.navigateByUrl("/index").then(r => console.log(r));
            this.userInfoService.setCurrentUser(res.user);
            this.storage.set("accessToken", res.content[0]);
            this.storage.set("refreshToken", res.content[1]);
          }
        }
      );
  }

  register() {
    const user: User = this.userRegisterProfile.value as User;
    this.userService.register(user)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        res => {
          console.log(res)
        }
      );
  }

  showLoginDialog(): void {
    this.isRegisterDialogVisible = false;
    this.isLoginDialogVisible = true;
  }

  showRegisterDialog() {
    this.isLoginDialogVisible = false;
    this.isRegisterDialogVisible = true;
  }
}
