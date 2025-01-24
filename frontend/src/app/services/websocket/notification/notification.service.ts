import { Injectable } from '@angular/core';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../../user/user.service';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
private stompClient!: Client;
    private messageSubject = new BehaviorSubject<string>('');

    constructor(private userService: UserService) { 
        this.initializeWebSocketConnection();
    }

    private initializeWebSocketConnection(): void {
        const userId = this.userService.getUserId(); // ดึง userId จาก AuthService

        if (!userId) {
            console.error('User ID not found. WebSocket connection cannot be initialized.');
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
