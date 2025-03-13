import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/auth/user/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule, FontAwesomeModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    faEnvelope = faEnvelope; // ไอคอน Email
    faLock = faLock; // ไอคอน Password
    faEye = faEye; // ไอคอน "แสดงรหัสผ่าน"
    faEyeSlash = faEyeSlash; // ไอคอน "ซ่อนรหัสผ่าน"

    email: string = '';
    password: string = '';
    errorMessage: string = '';
    showPassword: boolean = false; // ควบคุมการแสดงรหัสผ่าน

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    login(): void {
        this.userService.login(this.email, this.password).subscribe(
            (response) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'Welcome back!',
                    showConfirmButton: false,
                    timer: 1500
                });
                this.router.navigate(['/']);
            },
            (error) => {
                console.error('Login failed:', error);
                this.errorMessage = 'Login failed. Please check your email and password.';
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: this.errorMessage
                });
            }
        );
    }

    goToRegister(): void {
        this.router.navigate(['/register']);
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }
}