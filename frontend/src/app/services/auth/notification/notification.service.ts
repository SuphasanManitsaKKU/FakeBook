import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationRequestDto } from '../../../type';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  private apiUrl = environment.apiUrl; // ใช้ API URL จาก environment.ts

  constructor(private http: HttpClient) {}

  // ✅ ดึงการแจ้งเตือนของผู้ใช้
  getNotifications(userId: number): Observable<NotificationRequestDto[]> {
    return this.http.get<NotificationRequestDto[]>(`${this.apiUrl}/notifications/${userId}`, { withCredentials: true });
  }

  // ✅ อัปเดตการแจ้งเตือนเป็น "อ่านแล้ว"
  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/notifications/${notificationId}`, null, { withCredentials: true });
  }
}
