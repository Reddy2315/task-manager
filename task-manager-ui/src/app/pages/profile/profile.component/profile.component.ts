import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-profile.component',
  imports: [ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  private fb = inject(FormBuilder);
  private snackbar = inject(MatSnackBar);
  private auth = inject(AuthService);

  hidePassword = true;

  // Prefill if needed (e.g., fetched profile data)
  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(64)]],
  });

   ngOnInit(): void {
    const username = this.auth.getUsername();
    if (username) {
      this.form.patchValue({ username }); // prefill only username
    }
    // Leave password empty for security
  }

  get fc() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value;
    // TODO: call API service to update profile
    // this.profileService.updateCredentials(payload).subscribe(...)
    this.snackbar.open('Profile updated successfully', 'OK', { duration: 2500 });
    this.form.markAsPristine();
  }

  reset() {
    // Optionally restore original values fetched from backend
    this.form.reset({ username: '', password: '' });
    this.hidePassword = true;
  }

}
