import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../type';  // Import interface User
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiUrl; // ใช้ API URL จาก environment.ts

    constructor(private http: HttpClient) { }

    // ✅ ฟังก์ชันสำหรับการ Login
    login(username: string, password: string): Observable<any> {
        const body = { username, password };
        return this.http.post(`${this.apiUrl}/users/login`, body, { withCredentials: true });
    }

    // ✅ ฟังก์ชันสำหรับการ Register
    register(username: string, email: string, password: string): Observable<any> {
        console.log('Registering...');
        console.log(this.apiUrl);
        
        
        const body = { username, email, password };
        return this.http.post(`${this.apiUrl}/users/register`, body);
    }

    // ✅ ฟังก์ชันสำหรับดึง Users ทั้งหมด
    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users/all`, { withCredentials: true });
    }

    // ✅ ฟังก์ชันสำหรับดึง User ตาม ID
    getUserById(userId: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/users/${userId}`, { withCredentials: true });
    }

    // ✅ ฟังก์ชันสำหรับอัปเดตโปรไฟล์ผู้ใช้ (คืนค่าเป็น User)
    updateUserProfile(userId: number, updatedData: User): Observable<User> {
        updatedData.imageProfile = null; // ไม่สามารถอัปเดตรูปโปรไฟล์ได้ที่นี่
        updatedData.coverImage = null; // ไม่สามารถอัปเดตรูป Cover ได้ที่นี่
        return this.http.put<User>(`${this.apiUrl}/users/${userId}`, updatedData, { withCredentials: true });
    }

    // ✅ ฟังก์ชันสำหรับลบบัญชีผู้ใช้
    deleteUser(userId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/users/${userId}`, { withCredentials: true });
    }

    // ✅ อัปโหลดรูปโปรไฟล์
    uploadProfileImage(userId: number, file: File): Observable<string> {
        const formData = new FormData();
        formData.append('file', file); // ✅ ใส่ key "file" ให้ตรงกับ `@RequestParam("file")` ใน Spring Boot

        return this.http.post<string>(`${this.apiUrl}/users/${userId}/upload-profile`, formData, {
            // reportProgress: true,
            // observe: 'body',
            withCredentials: true
        });
    }


    // ✅ อัปโหลดรูป Cover
    uploadCoverImage(userId: number, file: File): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<string>(`${this.apiUrl}/users/${userId}/upload-cover`, formData, { withCredentials: true });
    }
}
