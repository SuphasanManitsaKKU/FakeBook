// user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// ถ้ามี Interface User
// import { User } from 'src/app/interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8080/api/users'; // URL ของ API

    constructor(private http: HttpClient) { }

    // ฟังก์ชันสำหรับการ Login
    login(username: string, password: string): Observable<any> {
        const body = { username, password };
        return this.http.post(`${this.apiUrl}/login`, body, { withCredentials: true });
    }

    // ฟังก์ชันสำหรับการ Register
    register(username: string, email: string, password: string): Observable<any> {
        const body = { username, email, password };
        return this.http.post(`${this.apiUrl}/register`, body);
    }

    // ฟังก์ชันสำหรับดึง Users ทั้งหมด
    getAllUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/all`, { withCredentials: true });
    }

    // ⭐ ฟังก์ชันสำหรับดึง User ตาม ID
    getUserById(userId: number): Observable<any> {
        // ถ้าคุณมี interface User, เปลี่ยน any -> User
        return this.http.get<any>(`${this.apiUrl}/${userId}`, { withCredentials: true });
    }
}
