import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserPublicService } from '../../services/userPublic/userPublic.service';
import { NotificationService } from './../../services/websocket/notification/notification.service';
import { NotificationRequestDto } from '../../type';

@Component({
    selector: 'app-notification',
    imports: [CommonModule],
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
    messages: NotificationRequestDto[] = [];
    unreadCount: number = 0; // ตั้งค่าเริ่มต้นเป็น 0
    isDropdownVisible: boolean = false;

    constructor(
        private userPublicService: UserPublicService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Subscribe เพื่อรับข้อความจาก WebSocket
        this.notificationService.getMessages().subscribe((message: string) => {
            try {
                // ตรวจสอบว่า message ไม่ว่างเปล่าหรือไม่
                if (message && message.trim() !== '') {
                    // แปลงข้อความที่ได้รับจาก WebSocket เป็น JavaScript object
                    const parsedMessage = JSON.parse(message);
    
                    // สร้าง NotificationRequestDto จากข้อมูลที่ได้รับ
                    const formattedMessage: NotificationRequestDto = {
                        userId: parsedMessage.userId, // ดึง userId จาก parsed message
                        message: parsedMessage.message, // ดึง message จาก parsed message
                        type: parsedMessage.type // ดึง type จาก parsed message
                    };
                    
                    // เพิ่มข้อความใหม่ลงใน list
                    this.messages.push(formattedMessage); 
                    this.unreadCount++; // เพิ่มจำนวนแจ้งเตือนที่ยังไม่ได้อ่าน
                } else {
                    console.warn('Received an empty or invalid message');
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });
    }

    // ฟังก์ชันเปิด/ปิด dropdown
    toggleNotifications(): void {
        this.isDropdownVisible = !this.isDropdownVisible;
        if (this.isDropdownVisible) {
            this.unreadCount = 0; // รีเซ็ตการแจ้งเตือนเมื่อเปิด dropdown
        }
    }

    // ฟังก์ชันนำทางไปยังรายละเอียดข้อความ
    navigateToMessageDetail(id: string): void {
        this.router.navigate(['/message', id]); // เปลี่ยนหน้าไปยังเส้นทาง /message/:id
    }
}
