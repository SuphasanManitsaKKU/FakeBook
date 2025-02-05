import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserPublicService {
  private userId: number = 0;
  private username: string = '';

  setUserInfo(userId: number, username: string): void {
    this.userId = userId;
    this.username = username;
    console.log('User info updated:', this.userId, this.username);
  }

  getUserId(): number {
    return this.userId;
  }

  getUsername(): string {
    return this.username;
  }
}
