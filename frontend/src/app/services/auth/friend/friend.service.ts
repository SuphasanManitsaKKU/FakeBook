import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FriendRequest, User } from '../../../type';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FriendService {

  private apiUrl = environment.apiUrl; // ใช้ API URL จาก environment.ts

  constructor(private http: HttpClient) { }

  // ดึงรายการเพื่อนทั้งหมด
  getAllFriends(userId: number): Observable<User[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<User[]>(`${this.apiUrl}/friends/getAllFriends`, { params, withCredentials: true });
  }

  // ลบเพื่อน
  removeFriend(userId: number, friendId: number): Observable<string> {
    const params = new HttpParams().set('userId', userId.toString()).set('friendId', friendId.toString());
    return this.http.delete<string>(`${this.apiUrl}/friends/remove`, { params, withCredentials: true });
  }

  // ส่งคำขอเป็นเพื่อน
  sendFriendRequest(senderId: number, receiverId: number): Observable<FriendRequest> {
    const params = new HttpParams().set('senderId', senderId.toString()).set('receiverId', receiverId.toString());
    return this.http.post<FriendRequest>(`${this.apiUrl}/friend-requests/send`, null, { params, withCredentials: true });
  }

  // ยอมรับคำขอเป็นเพื่อน
  acceptFriendRequest(requestId: number): Observable<FriendRequest> {
    const params = new HttpParams().set('requestId', requestId.toString());
    return this.http.post<FriendRequest>(`${this.apiUrl}/friend-requests/accept`, null, { params, withCredentials: true });
  }

  // ปฏิเสธคำขอเป็นเพื่อน
  rejectFriendRequest(requestId: number): Observable<FriendRequest> {
    const params = new HttpParams().set('requestId', requestId.toString());
    return this.http.post<FriendRequest>(`${this.apiUrl}/friend-requests/reject`, null, { params, withCredentials: true });
  }

  // ยกเลิกคำขอเป็นเพื่อน
  cancelFriendRequest(requestId: number): Observable<string> {
    const params = new HttpParams().set('requestId', requestId.toString());
    return this.http.delete<string>(`${this.apiUrl}/friend-requests/cancel`, { params, withCredentials: true });
  }

  // ดูคำขอที่เราส่งไปแล้ว แต่ยังไม่ได้รับการตอบรับ
  getSentPendingRequests(userId: number): Observable<FriendRequest[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/friend-requests/sent-pending`, { params, withCredentials: true });
  }

  // ดูคำขอที่เพื่อนส่งมาให้เรา แต่เรายังไม่ได้ตอบรับ
  getReceivedPendingRequests(userId: number): Observable<FriendRequest[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/friend-requests/received-pending`, { params, withCredentials: true });
  }
}
