import { inject, Injectable } from "@angular/core";
import { Notif, User } from "../models/model";
import { UserInfoService } from "./user-info.service";
import { HttpClient } from "@angular/common/http";
import { NOTIF_API } from "../data/const";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  httpClient = inject(HttpClient);

  getNotifs(id: number) {
    return this.httpClient.get<Notif[]>(NOTIF_API + "/getByReceiver/" + id);
  }
}
