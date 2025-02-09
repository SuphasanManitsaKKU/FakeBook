import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificationServiceSocket {
    private stompClient: Client | null = null;
    private messageSubject = new Subject<string>(); // ✅ ใช้ Subject แทน BehaviorSubject

    constructor() {}

    initializeWebSocketConnection(userId: number): void {
        if (!userId || userId === 0) {
            console.warn('❌ User is not logged in. Skipping WebSocket connection.');
            return;
        }

        if (this.stompClient && this.stompClient.active) {
            console.log('⚡ WebSocket is already connected.');
            return;
        }

        this.stompClient = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        });

        this.stompClient.onConnect = () => {
            console.log('✅ Connected to WebSocket via STOMP');

            this.stompClient?.subscribe(`/notification/messages/${userId}`, (message: IMessage) => {
                console.log("📩 Received WebSocket message:", message.body);

                if (!message.body || message.body.trim() === '') {
                    console.warn("⚠️ Received an empty message from WebSocket.");
                    return;
                }

                this.messageSubject.next(message.body); // ✅ ส่งค่าทุกครั้งที่มีการแจ้งเตือนใหม่
            });
        };

        this.stompClient.activate();
    }

    getMessages(): Observable<string> {
        return this.messageSubject.asObservable();
    }
}
