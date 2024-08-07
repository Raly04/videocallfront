import {inject, Injectable} from '@angular/core';
import {RefreshTokenResponse, User} from "../models/model";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private readonly storage = inject((StorageService));

  constructor() {
  }

  private _currentReceiver !: User;

  get currentReceiver(): User {
    if (!this._currentUser) return JSON.parse(this.storage.get("c_r") as string) as User;
    return this._currentReceiver;
  }

  private _userToken !: RefreshTokenResponse;

  get userToken(): RefreshTokenResponse {
    if (!this._currentUser) return JSON.parse(this.storage.get("TOKEN_INFO") as string) as RefreshTokenResponse;
    return this._userToken;
  }

  private _currentUser !: User;

  get currentUser(): User {
    if (!this._currentUser) return JSON.parse(this.storage.get("c_u") as string) as User;
    return this._currentUser;
  }

  setUserToken(value: RefreshTokenResponse){
    this._userToken = value;
  }

  setCurrentUser(value: User) {
    this.storage.set("c_u", JSON.stringify(value));
    this._currentUser = value;
  }

  setCurrentReceiver(value: User) {
    this.storage.set("c_r", JSON.stringify(value));
    this._currentReceiver = value;
  }
}
