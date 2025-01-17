import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // นำเข้า FormsModule
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule], // นำเข้า CommonModule และ FormsModule
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    username: string = '';
    password: string = '';
    errorMessage: string = '';

    constructor(private router: Router) { }

    async login() {
        if (!this.username || !this.password) {
            this.errorMessage = 'Please fill in all fields.';
            return;
        }

        const apiUrl = 'http://localhost:8080/api/login';

        try {
            const response = await axios.post(apiUrl, {
                username: this.username,
                password: this.password,
            }, { withCredentials: true });

            if (response.status === 200) {
                this.router.navigate(['/dashboard']); // Redirect to dashboard
            }
        } catch (error) {
            this.errorMessage = 'Invalid username or password. Please try again.';
        }
    }

    goToRegister() {
        this.router.navigate(['/register']);
    }
}
