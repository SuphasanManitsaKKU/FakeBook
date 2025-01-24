import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userId: number = 0; // ตัวแปรสำหรับเก็บ userId
  private username: string = ''; // ตัวแปรสำหรับเก็บ username

  constructor() { }

  // Setter สำหรับ userId และ username
  setUserInfo(userId: number, username: string): void {
    this.userId = userId;
    this.username = username;
  }

  // Getter สำหรับ userId
  getUserId(): number {
    console.log('current user id:', this.userId);
    return this.userId;
  }

  // Getter สำหรับ username
  getUsername(): string {
    return this.username ?? '';
  }

  // Clear ข้อมูลเมื่อ logout
  clearUserInfo(): void {
    this.userId = 0;
    this.username = '';
  }
}
