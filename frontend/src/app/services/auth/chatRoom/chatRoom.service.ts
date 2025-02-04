import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../../type';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {
  private apiUrl = 'http://localhost:8080'; // URL ของ API

  constructor(private http: HttpClient) { }
  getOrCreateChatRoom(userOneId: number, userTwoId: number): Observable<any> {
    console.log(userOneId, userTwoId);

    return this.http.get(`${this.apiUrl}/api/chat/room?userOneId=${userOneId}&userTwoId=${userTwoId}`, { withCredentials: true });
  }

  getMessages(chatRoomId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/chat/messages?chatRoomId=${chatRoomId}`, { withCredentials: true });
  }

}
