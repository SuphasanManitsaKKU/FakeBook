import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule], // สำหรับ Standalone Component
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'], // แก้ไขจาก styleUrl เป็น styleUrls
})

export class LoginComponent {

    username: string = '';
    password: string = '';
    errorMessage: string = '';

    constructor(
        private authService: AuthService, // Inject AuthService
        private router: Router
    ) { }

    login(): void {
        this.authService.login(this.username, this.password).subscribe(
            (response) => {
                console.log('Login successful:', response);

                this.router.navigate(['/']);
            },
            (error) => {
                console.error('Login failed:', error);
                this.errorMessage = 'Login failed. Please check your username and password.';
            }
        );
    }

    goToRegister(): void {
        this.router.navigate(['/register']); // เปลี่ยนไปยังหน้า Register
    }
}
