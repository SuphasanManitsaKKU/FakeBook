import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/auth/user/user.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  emailError: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  get passwordValidLength(): boolean {
    return this.password.length >= 8;
  }

  get passwordHasUppercase(): boolean {
    return /[A-Z]/.test(this.password);
  }

  get passwordHasNumber(): boolean {
    return /\d/.test(this.password);
  }

  get passwordHasSpecialChar(): boolean {
    return /[@$!%*?&]/.test(this.password);
  }

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  register(): void {
    this.emailError = '';
    this.errorMessage = '';

    if (!this.validateEmail(this.email)) {
      this.emailError = 'Please enter a valid email address.';
      return;
    }

    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    if (!this.passwordValidLength || !this.passwordHasUppercase || !this.passwordHasNumber || !this.passwordHasSpecialChar) {
      this.errorMessage = 'Password does not meet all requirements.';
      return;
    }

    if (!this.passwordsMatch) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.userService.register(this.username, this.email, this.password).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed:', error);
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}