import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserPublicService } from '../../services/userPublic/userPublic.service';
import { NotificationServiceSocket } from '../../services/websocket/notification/notificationSocket.service';
import { NotificationRequestDto } from '../../type';
import { NotificationService } from '../../services/auth/notification/notification.service';

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
        private notificationServiceSocket: NotificationServiceSocket,
        private router: Router,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.userId = this.userPublicService.getUserId();
        console.log("🔎 Checking User ID:", this.userId);

        if (!this.userId || this.userId === 0) {
            console.warn("⚠️ User ID is not available. Retrying...");
            setTimeout(() => {
                this.userId = this.userPublicService.getUserId();
                console.log('🔄 Retried User ID:', this.userId);

                if (!this.userId || this.userId === 0) {
                    console.warn("❌ User ID still not found. Skipping WebSocket connection.");
                    return;
                }

                this.notificationService.getNotifications(this.userId).subscribe({
                    next: (notifications) => {
                      this.messages = notifications;
                      this.unreadCount = notifications.length;
                    },
                    error: (err) => console.error('โหลดแจ้งเตือนล้มเหลว:', err)
                  });

                this.notificationServiceSocket.initializeWebSocketConnection(this.userId);

                this.notificationServiceSocket.getMessages().subscribe((message: string | null) => {
                    console.log("📩 WebSocket Data Received:", message);

                    if (!message || message.trim() === '') {
                        console.warn("⚠️ Received an empty message.");
                        return;
                    }

                    try {
                        const parsedMessage = JSON.parse(message);
                        console.log("✅ Parsed WebSocket message:", parsedMessage);

                        if (!parsedMessage.message || !parsedMessage.userId) {
                            console.warn("⚠️ Invalid notification format:", parsedMessage);
                            return;
                        }

                        this.messages.push({
                            userId: parsedMessage.userId || '',
                            message: parsedMessage.message || 'No message content',
                            type: parsedMessage.type || 'info',
                            contentId: parsedMessage.contentId || '',
                        });

                        console.log("📌 Updated messages:", this.messages);
                        this.unreadCount++;
                    } catch (error) {
                        console.error("❌ Error parsing WebSocket message:", error);
                    }
                });

            }, 1000);
            return;
        }


    }

    toggleNotifications(): void {
        this.isDropdownVisible = !this.isDropdownVisible;
        if (this.isDropdownVisible) {
            this.unreadCount = 0;
        }
    }

    navigateToMessageDetail(id: string): void {
        console.log("🔍 Navigating to message detail:", id);
        
        this.router.navigate(['/post', id]);
    }
}
