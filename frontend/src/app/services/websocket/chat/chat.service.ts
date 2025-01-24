import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../../../type';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:8080/api/chat';
  private stompClient!: Client;
  private messagesSubject = new BehaviorSubject<any[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection(): void {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      },
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
    };

    this.stompClient.activate();
  }

  // WebSocket: Subscribe ห้องแชท
  subscribeToChatRoom(chatRoomId: number): void {
    console.log('Subscribing to chat room:', chatRoomId);

    this.stompClient.subscribe(`/room/${chatRoomId}`, (message: IMessage) => {
      console.log('Received message:', message.body);
      
      const newMessage : Message[] = JSON.parse(message.body); // แปลงข้อความเป็น object
      // เพิ่มข้อความใหม่ลงใน messagesSubject เพื่อให้แสดงใน chat
      this.messagesSubject.next([...this.messagesSubject.value, newMessage]);
    });
  }


  // WebSocket: ส่งข้อความใหม่
  sendMessage(chatRoomId: number, senderId: number, content: string): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/sendMessage/${chatRoomId}`,
        body: JSON.stringify({ chatRoomId, senderId, content }),
      });
    } else {
      console.error('STOMP client is not connected');
    }
  }
}
