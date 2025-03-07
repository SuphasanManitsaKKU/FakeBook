import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {
  private apiUrl = environment.apiUrl; // ใช้ API URL จาก environment.ts

  constructor(private http: HttpClient) { }
  getOrCreateChatRoom(userOneId: number, userTwoId: number): Observable<any> {
    console.log(userOneId, userTwoId);

    return this.http.get(`${this.apiUrl}/chat/room?userOneId=${userOneId}&userTwoId=${userTwoId}`, { withCredentials: true });
  }

  getMessages(chatRoomId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/chat/messages?chatRoomId=${chatRoomId}`, { withCredentials: true });
  }

}
