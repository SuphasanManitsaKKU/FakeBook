import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserPublicService } from '../../services/userPublic/userPublic.service';
import { NotificationService } from './../../services/websocket/notification/notification.service';
import { NotificationRequestDto } from '../../type';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
    messages: NotificationRequestDto[] = [];
    unreadCount: number = 0;
    isDropdownVisible: boolean = false;
    userId: number | null = null;

    constructor(
        private userPublicService: UserPublicService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.userId = this.userPublicService.getUserId();
        
        if (!this.userId || this.userId === 0) {
            console.warn("User ID is not available. Trying to retrieve again...");
            setTimeout(() => {
                this.userId = this.userPublicService.getUserId();
                console.log('User ID after retry:', this.userId);

                if (!this.userId || this.userId === 0) {
                    console.warn("User ID still not found. Skipping WebSocket connection.");
                    return;
                }

                this.notificationService.initializeWebSocketConnection(this.userId);
            }, 1000); 
            return;
        }

        this.notificationService.initializeWebSocketConnection(this.userId);

        this.notificationService.getMessages().subscribe((message: string) => {
            if (!message || message.trim() === '') {
                console.warn('Received an empty message.');
                return;
            }

            try {
                const parsedMessage = JSON.parse(message);
                const formattedMessage: NotificationRequestDto = {
                    userId: parsedMessage.userId || '',
                    message: parsedMessage.message || 'No message content',
                    type: parsedMessage.type || 'info'
                };

                this.messages.push(formattedMessage);
                this.unreadCount++;
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        });
    }

    toggleNotifications(): void {
        this.isDropdownVisible = !this.isDropdownVisible;
        if (this.isDropdownVisible) {
            this.unreadCount = 0;
        }
    }

    navigateToMessageDetail(id: string): void {
        this.router.navigate(['/message', id]);
    }
}
