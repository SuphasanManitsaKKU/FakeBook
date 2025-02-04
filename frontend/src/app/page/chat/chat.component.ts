import { FriendService } from './../../services/auth/friend/friend.service';
import { UserService } from '../../services/auth/user/user.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../../services/websocket/chat/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserPublicService } from '../../services/userPublic/userPublic.service';
import { User, Message } from '../../type';
import { ChatRoomService } from '../../services/auth/chatRoom/chatRoom.service';

@Component({
    selector: 'app-chat',
    imports: [CommonModule, FormsModule],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
    friends: User[] = [];
    chatMessages: Message[] = [];
    currentChatRoomId!: number;
    currentUserId = 0; // Mock user ID
    message = '';
    isLoading = false; // ตัวแปรสำหรับแสดง Loading
    errorMessage = ''; // ตัวแปรสำหรับข้อความ Error

    constructor(private chatService: ChatService, private chatRoomService: ChatRoomService,private friendService: FriendService,private userService: UserService, private userPublicService: UserPublicService) { }

    ngOnInit(): void {
        this.currentUserId = this.userPublicService.getUserId();

        // เรียก API เพื่อดึงข้อมูลเพื่อน
        this.isLoading = true;
        this.friendService.getAllFriends(this.currentUserId).subscribe({
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

        this.chatRoomService.getOrCreateChatRoom(this.currentUserId, friendId).subscribe({
            next: (chatRoom) => {
                this.currentChatRoomId = chatRoom.id;

                // โหลดข้อความเก่า
                this.chatRoomService.getMessages(this.currentChatRoomId).subscribe({
                    next: (messages) => {
                        console.log('---1');

                        this.chatMessages = messages.reverse();

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
                    console.log('---2', messages, "---2");
                
                    // กรองข้อความที่ยังไม่มีใน this.chatMessages
                    const newMessages = messages.filter(
                        (msg) => !this.chatMessages.some((existingMsg) => existingMsg.id === msg.id)
                    );
                
                    // อัปเดต chatMessages โดยเพิ่มเฉพาะข้อความใหม่
                    this.chatMessages = [...newMessages, ...this.chatMessages];
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
}