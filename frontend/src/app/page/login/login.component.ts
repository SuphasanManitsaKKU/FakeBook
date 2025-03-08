import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/auth/user/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule, FontAwesomeModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})

export class LoginComponent {

    faEnvelope = faEnvelope; // ไอคอน Email
    faLock = faLock; // ไอคอน Password

    email: string = '';
    password: string = '';
    errorMessage: string = '';

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    login(): void {
        this.userService.login(this.email, this.password).subscribe(
            (response) => {
                console.log('Login successful:', response);

                this.router.navigate(['/']);
            },
            (error) => {
                console.error('Login failed:', error);
                this.errorMessage = 'Login failed. Please check your email and password.';
            }
        );
    }

    goToRegister(): void {
        this.router.navigate(['/register']);
    }
}