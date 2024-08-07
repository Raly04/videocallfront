import { inject, Injectable } from '@angular/core';
import { UserService } from "./user.service";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, switchMap, take, filter, Observable, throwError, BehaviorSubject } from "rxjs";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private readonly userService: UserService = inject(UserService);
  private readonly storage: StorageService = inject(StorageService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let accessToken = this.storage.get("accessToken") as string;
    
    if (accessToken) {
      request = this.addToken(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.userService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          this.storage.set("accessToken", token);
          return next.handle(this.addToken(request, token));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.storage.remove("accessToken"); // Clear the token on refresh failure
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }
}