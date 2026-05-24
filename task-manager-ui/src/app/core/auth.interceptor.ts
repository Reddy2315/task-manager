import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  const isAuthRequest =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register');

  const token = localStorage.getItem('tm_token');

  if (token && !isAuthRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((err) => {

      // if (!isAuthRequest &&
      //     (err.status === 401 || err.status === 403)) {

      //   localStorage.removeItem('tm_token');
      //   router.navigate(['/login']);
      // }

      return throwError(() => err);
    })
  );
};
