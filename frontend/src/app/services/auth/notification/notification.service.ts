import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationRequestDto } from '../../../type';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/notifications'; // ✅ URL ของ Backend API

  constructor(private http: HttpClient) {}

  // ✅ ดึงการแจ้งเตือนของผู้ใช้
  getNotifications(userId: number): Observable<NotificationRequestDto[]> {
    return this.http.get<NotificationRequestDto[]>(`${this.apiUrl}/${userId}`, { withCredentials: true });
  }

  // ✅ อัปเดตการแจ้งเตือนเป็น "อ่านแล้ว"
  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${notificationId}`, null, { withCredentials: true });
  }
}
