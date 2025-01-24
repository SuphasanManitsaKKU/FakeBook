import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../../services/websocket/chat/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';

@Component({
    selector: 'app-chat',
    imports: [CommonModule, FormsModule],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
    @ViewChild('scrollableArea') scrollableArea!: ElementRef;
    friends: any[] = [];
    chatMessages: any[] = [];
    currentChatRoomId!: number;
    currentUserId = 1; // Mock user ID
    message = '';
    isLoading = false; // ตัวแปรสำหรับแสดง Loading
    errorMessage = ''; // ตัวแปรสำหรับข้อความ Error

    constructor(private chatService: ChatService, private authService: AuthService, private userService: UserService) { }

    ngOnInit(): void {
        this.currentUserId = this.userService.getUserId();

        // เรียก API เพื่อดึงข้อมูลเพื่อน
        this.isLoading = true;
        this.authService.getAllFriends(this.currentUserId).subscribe({
            next: (friends) => {
                this.friends = friends; // ตั้งค่ารายชื่อเพื่อน
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading friends:', err);
                this.errorMessage = 'Failed to load friends. Please try again later.';
                this.isLoading = false;
            },
        });
    }

    selectFriend(friendId: number): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.authService.getOrCreateChatRoom(this.currentUserId, friendId).subscribe({
            next: (chatRoom) => {
                this.currentChatRoomId = chatRoom.id;

                // โหลดข้อความเก่า
                this.authService.getMessages(this.currentChatRoomId).subscribe({
                    next: (messages) => {
                        this.chatMessages = messages;
                        this.isLoading = false;
                    },
                    error: (err) => {
                        console.error('Error loading messages:', err);
                        this.errorMessage = 'Failed to load messages. Please try again later.';
                        this.isLoading = false;
                    },
                });

                // Subscribe to chat room for new messages
                this.chatService.subscribeToChatRoom(this.currentChatRoomId);

                // Subscribe to messages$ observable
                this.chatService.messages$.subscribe((messages) => {
                    this.chatMessages = messages;  // Update chatMessages when messages change
                });
            },
            error: (err) => {
                console.error('Error creating or fetching chat room:', err);
                this.errorMessage = 'Failed to create or load chat room.';
                this.isLoading = false;
            },
        });
    }

    sendMessage(): void {
        if (this.message.trim()) {
            this.chatService.sendMessage(this.currentChatRoomId, this.currentUserId, this.message);
            this.message = ''; // ล้างข้อความในช่องป้อนข้อมูล
        }
    }

    scrollToBottom(): void {
        try {
          const scrollArea = this.scrollableArea.nativeElement;
          scrollArea.scrollTop = scrollArea.scrollHeight;
        } catch (err) {
          console.error('Scroll to bottom failed:', err);
        }
      }
}