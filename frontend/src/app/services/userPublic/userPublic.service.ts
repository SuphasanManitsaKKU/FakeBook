import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserPublicService {
  private userId: number = 0;
  private userIdSubject = new BehaviorSubject<number | null>(null);
  private username: string = '';

  setUserInfo(userId: number, username: string): void {
    this.userId = userId;
    this.userIdSubject.next(userId); // ✅ แจ้งเตือนการเปลี่ยนแปลงให้ Component ที่ subscribe
    this.username = username;
    console.log('User info updated:', this.userId, this.username);
  }

  getUserId(): number {
    return this.userId;
  }

  getUsername(): string {
    return this.username;
  }

  getUserIdObservable() {
    return this.userIdSubject.asObservable(); // ✅ ใช้ subscribe ใน Component
  }
}
