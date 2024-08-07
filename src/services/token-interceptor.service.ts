import {inject, Injectable} from '@angular/core';
import {UserService} from "./user.service";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, switchMap, take, filter} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  private readonly userService: UserService = inject(UserService);
  private readonly storage: StorageService = inject(StorageService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.storage.get("accessToken") as string;
    if (accessToken) {
      request = this.addToken(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(()=> new Error("Error refreshing token"));
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    return this.userService.refreshToken().pipe(
      switchMap((token: any) => {
        this.storage.set("accessToken",token);
        return next.handle(this.addToken(request, token));
      }),
      catchError((err) => {
        return throwError(()=>new Error(err));
      })
    );
  }
}
