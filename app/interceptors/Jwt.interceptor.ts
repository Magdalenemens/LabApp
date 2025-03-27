import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { AuthService } from '../modules/auth/auth.service';
import { Router } from '@angular/router';
import { EncryptionHelper } from './encryption-helper';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  token: string;
  constructor(public _authService: AuthService, private router: Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
      this._authService.token$.subscribe(_token => {
        if (_token)
          this.token = _token
  
      });
    } catch (error) {
      // this.router.navigate(['/login']);
    }
    

    if (this.token) {
      this.token = EncryptionHelper.decrypt(this.token)
      const token = this.token;

      // Validate the token.
      try {
        const decodedToken: any = jwt_decode.jwtDecode(token);
        // Check the expiration time (exp) of the token
        if (decodedToken.exp < Date.now() / 1000) {
          throw new Error('Token has expired');
        }
        this.token = EncryptionHelper.encrypt(this.token)
        // If token is valid, add it to the request headers
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.token}`
          }
        });
      } catch (error) {
        console.error('Token validation error:', error);
        // Handle token validation error (e.g., redirect to login page)
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle error response
        // this.router.navigate(['/login']);
        if (error.status === 401) {
          this.router.navigate(['/login']);
          // Token might be invalid, expired, or user is not authorized
          // Handle unauthorized error (e.g., redirect to login page)
        }
        return throwError(error);
      })
    );
  }
}
