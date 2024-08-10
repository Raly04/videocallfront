import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthResponse, User } from "../models/model";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { USER_API } from "../data/const";
import { StorageService } from "./storage.service";
import { catchError, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly httpClient = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  authenticate(user: User) {
    console.log(user);
    return this.httpClient.post<AuthResponse>(USER_API + "/authenticate", user);
  }

  register(user: User) {
    return this.httpClient.post<User>(USER_API + "/create", user);
  }

  findById(id: number) {
    return this.httpClient.get<User>(USER_API + "/findById/" + id);
  }

  getUserAvatar(userId: number): Observable<Blob> {
    const headers = new HttpHeaders({ 'Accept': 'image/*' });
    return this.httpClient.get<Blob>(`${USER_API}/avatar/${userId}`, {
      headers: headers,
      responseType: 'blob' as 'json'  // Response as Blob
    });
  }

  getAll() {
    return this.httpClient.get<User[]>(USER_API + "/getAll");
  }

  getContacts(id : number) : Observable<User[]> {
    return this.httpClient.get<User[]>(USER_API + "/contacts/"+id);
  }

  uploadAvatar(userId: number, file: File) {
  const data = new FormData();
  data.append("avatar", file);
  data.append("userId", userId.toString());
  return this.httpClient.post<any>(USER_API + "/uploadUserAvatar", data, {
    reportProgress: true,
  });
}

  refreshToken(): Observable<any> {
    if (this.refreshTokenInProgress) {
      return new Observable(observer => {
        this.refreshTokenSubject.subscribe({
          next: token => {
            observer.next(token);
            observer.complete();
          },
          error: err => {
            observer.error(err);
          }
        });
      });
    } else {
      this.refreshTokenInProgress = true;
      return this.httpClient.post(`${USER_API}/refreshToken`, {
        token: this.storage.get("refreshToken")
      }).pipe(
        switchMap((response: any) => {
          this.refreshTokenInProgress = false;
          this.storage.set("accessToken", response.accessToken);
          this.refreshTokenSubject.next(response.accessToken);
          return new BehaviorSubject(response.accessToken).asObservable();
        }),
        catchError(err => {
          this.refreshTokenInProgress = false;
          this.handleError(err);
          return throwError(() => new Error(err));
        })
      );
    }
  }

  private handleError(error: any): Observable<never> {
    return throwError(() => new Error(error));
  }


  logout() {
    this.storage.clear();
  }
}
