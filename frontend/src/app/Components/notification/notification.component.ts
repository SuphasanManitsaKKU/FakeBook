import { NotificationService } from './../../services/websocket/notification/notification.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
    selector: 'app-notification',
    imports: [CommonModule],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
    messages: { text: string, id: string }[] = [];
    unreadCount: number = -1;
    isDropdownVisible: boolean = false;

    constructor(
        private userService: UserService,
        private notificationService: NotificationService,
        private router: Router
    ) {

    }

    ngOnInit(): void {
        this.notificationService.getMessages().subscribe((message: string) => {
            const formattedMessage = { text: message, id: this.userService.getUserId().toString() }; // เพิ่ม userId ในข้อความ
            this.messages.push(formattedMessage);
            this.unreadCount++;
        });
    }

    toggleNotifications(): void {
        this.isDropdownVisible = !this.isDropdownVisible;
        if (this.isDropdownVisible) {
            this.unreadCount = 0; // รีเซ็ตการแจ้งเตือนเมื่อเปิด dropdown
        }
    }

    navigateToMessageDetail(id: string): void {
        this.router.navigate(['/message', id]); // เปลี่ยนหน้าไปยังเส้นทาง /message/:id
    }
}
