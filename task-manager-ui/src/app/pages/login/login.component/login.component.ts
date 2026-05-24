import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login.component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';

  errorMessage = '';
  isLoading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  clearError(): void {
    this.errorMessage = '';
  }

  submit(): void {

    this.errorMessage = '';
    this.isLoading = true;

    this.auth.login(this.username, this.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/board');
        },
        error: (err: HttpErrorResponse) => {

          this.isLoading = false;

          if (err.status === 401 || err.status === 403) {
            this.errorMessage =
              err.error?.message || 'Invalid username or password';
          } else {
            this.errorMessage =
              'Unable to login right now. Please try again.';
          }

          this.cdr.detectChanges();
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}