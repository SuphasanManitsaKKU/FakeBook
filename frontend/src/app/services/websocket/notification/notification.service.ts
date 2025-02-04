import { Injectable } from '@angular/core';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserPublicService } from '../../userPublic/userPublic.service';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private stompClient!: Client;
    private messageSubject = new BehaviorSubject<string>('');

    constructor(private userPublicService: UserPublicService) {
        this.initializeWebSocketConnection();
    }

    private initializeWebSocketConnection(): void {
        setTimeout(() => {
            const userId = this.userPublicService.getUserId(); // ดึง userId จาก AuthService

            if (!userId || userId === 0) {
                console.error('User ID not found (or 0). Cannot initialize WebSocket.');
                return;
            }

            this.stompClient = new Client({
                brokerURL: 'ws://localhost:8080/ws',
                reconnectDelay: 5000,
                debug: (str) => {
                    console.log(str);
                },
            });

            this.stompClient.onConnect = () => {
                console.log('Connected to WebSocket via STOMP');

                // ใช้ userId เพื่อ Subscribe Channel ที่เฉพาะสำหรับ User
                this.stompClient.subscribe(`/notification/messages/${userId}`, (message: IMessage) => {
                    this.messageSubject.next(message.body);
                });
            };

            this.stompClient.onStompError = (frame) => {
                console.error('Broker reported error: ', frame.headers['message']);
                console.error('Additional details: ', frame.body);
            };

            this.stompClient.activate();
        }, 500); // รอ 2 วินาทีเพื่อให้ UserPublicService ทำงานเสร็จก่อน
    }

    sendMessage(message: string): void {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: '/app/sendMessage', // ตรงกับ @MessageMapping
                body: message,
            });
        } else {
            console.error('STOMP client is not connected');
        }
    }

    getMessages(): Observable<string> {
        return this.messageSubject.asObservable();
    }
}
