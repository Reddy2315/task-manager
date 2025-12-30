import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('tm_token');

  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401 || err.status === 403) {
        const router = inject(Router);
        localStorage.removeItem('tm_token');
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};


// import { Injectable } from '@angular/core';
// import { HttpInterceptorFn } from '@angular/common/http';
// // @Injectable({
// //   providedIn: 'root'
// // })

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('tm_token');
//   if (token) {
//     req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
//   }
//   return next(req);
// };