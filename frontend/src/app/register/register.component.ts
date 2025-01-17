import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [CommonModule, FormsModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    username: string = '';
    email: string = '';
    password: string = '';
    confirmPassword: string = '';
    errorMessage: string = '';
    emailError: string = '';

    constructor(private router: Router) { }

    validateEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    async register() {
        // Reset errors
        this.emailError = '';
        this.errorMessage = '';

        // ตรวจสอบว่า email ถูกต้องหรือไม่
        if (!this.validateEmail(this.email)) {
            this.emailError = 'Please enter a valid email address.';
            return;
        }

        if (!this.username || !this.email || !this.password || !this.confirmPassword) {
            this.errorMessage = 'All fields are required.';
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.errorMessage = 'Passwords do not match.';
            return;
        }

        const apiUrl = 'http://localhost:8080/api/register';

        try {
            const response = await axios.post(apiUrl, {
                username: this.username,
                email: this.email,
                password: this.password,
            });

            if (response.status === 201) {
                this.router.navigate(['/login']);
            }
        } catch (error) {
            this.errorMessage = 'Registration failed. Please try again.';
        }
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }
}
