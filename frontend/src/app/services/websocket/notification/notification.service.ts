import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private stompClient!: Client;
    private messageSubject = new BehaviorSubject<string>('');

    constructor() {}

    initializeWebSocketConnection(userId: number): void {
        if (!userId || userId === 0) {
            console.warn('User is not logged in. Skipping WebSocket connection.');
            return;
        }

        if (this.stompClient && this.stompClient.connected) {
            console.log('WebSocket is already connected.');
            return;
        }

        this.stompClient = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        });

        this.stompClient.onConnect = () => {
            console.log('Connected to WebSocket via STOMP');
            this.stompClient.subscribe(`/notification/messages/${userId}`, (message: IMessage) => {
                if (!message.body || message.body.trim() === '') {
                    console.warn("Received an empty message from WebSocket.");
                    return;
                }
                this.messageSubject.next(message.body);
            });
        };

        this.stompClient.onStompError = (frame) => {
            console.error('Broker reported error:', frame.headers['message']);
            console.error('Additional details:', frame.body);
        };

        this.stompClient.activate();
    }

    sendMessage(message: string): void {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: '/app/sendMessage',
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
