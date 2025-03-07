import { Component, OnInit } from '@angular/core';
import { FriendService } from '../../services/auth/friend/friend.service';
import { UserPublicService } from '../../services/userPublic/userPublic.service';
import { User, FriendRequest } from '../../type';  
import { UserService } from '../../services/auth/user/user.service';
import { FeedHomeComponent } from "../../Components/feed-home/feed-home.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FeedHomeComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  friendRequests: FriendRequest[] = [];  // ✅ คำขอเป็นเพื่อนที่ได้รับ
  friendsList: User[] = [];              // ✅ รายชื่อเพื่อน
  users: User[] = [];                    // ✅ รายชื่อผู้ใช้ทั้งหมด
  loggedInUserId: number = 0;
  pendingRequests: number[] = [];        // ✅ คำขอที่เราส่งไปแล้ว

  constructor(
    private friendService: FriendService,
    private userPublicService: UserPublicService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loggedInUserId = this.userPublicService.getUserId(); 
    this.loadAllUsers();
    this.loadFriends();
    this.loadPendingRequests();
    this.loadReceivedFriendRequests();  // ✅ โหลดคำขอที่ได้รับ
  }

  /** ✅ โหลดรายการผู้ใช้ทั้งหมด */
  loadAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.filter(user => user.id != this.loggedInUserId); // ✅ ไม่แสดงตัวเอง
      },
      error: (err) => console.error('โหลดรายชื่อผู้ใช้ล้มเหลว:', err)
    });
  }

  /** ✅ โหลดรายการเพื่อนของผู้ใช้ */
  loadFriends(): void {
    if (!this.loggedInUserId) return;
    this.friendService.getAllFriends(this.loggedInUserId).subscribe({
      next: (friends) => {
        this.friendsList = friends;
      },
      error: (err) => console.error('โหลดรายชื่อเพื่อนล้มเหลว:', err)
    });
  }

  /** ✅ โหลดคำขอเป็นเพื่อนที่ส่งไปแล้ว */
  loadPendingRequests(): void {
    if (!this.loggedInUserId) return;
    this.friendService.getSentPendingRequests(this.loggedInUserId).subscribe({
      next: (requests) => {
        this.pendingRequests = requests.map(req => req.receiver.id);
      },
      error: (err) => console.error('โหลดรายการคำขอเป็นเพื่อนล้มเหลว:', err)
    });
  }

  /** ✅ โหลดคำขอเป็นเพื่อนที่ได้รับ */
  loadReceivedFriendRequests(): void {
    if (!this.loggedInUserId) return;
    this.friendService.getReceivedPendingRequests(this.loggedInUserId).subscribe({
      next: (requests) => {
        this.friendRequests = requests;
      },
      error: (err) => console.error('โหลดคำขอเป็นเพื่อนล้มเหลว:', err)
    });
  }

  /** ✅ เช็คว่า user เป็นเพื่อนแล้วหรือยัง */
  isFriend(userId: number): boolean {
    return this.friendsList.some(friend => friend.id === userId);
  }

  /** ✅ เช็คว่ามีคำขอเป็นเพื่อนที่รออยู่หรือไม่ */
  isPendingRequest(userId: number): boolean {
    return this.pendingRequests.includes(userId);
  }

  /** ✅ ส่งคำขอเป็นเพื่อน */
  addFriend(userId: number): void {
    if (!this.loggedInUserId) return;
    this.friendService.sendFriendRequest(this.loggedInUserId, userId).subscribe({
      next: () => {
        console.log('ส่งคำขอเป็นเพื่อนสำเร็จ');
        this.pendingRequests.push(userId);
      },
      error: (err) => console.error('ส่งคำขอเป็นเพื่อนล้มเหลว:', err)
    });
  }

  /** ✅ ยอมรับคำขอเป็นเพื่อน */
  acceptFriend(requestId: number) {
    this.friendService.acceptFriendRequest(requestId).subscribe({
      next: () => {
        this.friendRequests = this.friendRequests.filter(r => r.id !== requestId);
        this.loadFriends(); // ✅ โหลดเพื่อนใหม่
        window.location.reload(); // ✅ รีโหลดหน้าเว็บ
      },
      error: (err) => console.log(err),
    });
  }

  /** ✅ ปฏิเสธคำขอเป็นเพื่อน */
  rejectFriend(requestId: number) {
    this.friendService.rejectFriendRequest(requestId).subscribe({
      next: () => {
        this.friendRequests = this.friendRequests.filter(r => r.id !== requestId);
      },
      error: (err) => console.log(err),
    });
  }

  /** ✅ ไปที่หน้าโปรไฟล์ของผู้ใช้ */
  goToUserDetail(userId: number) {
    this.router.navigate(['/user', userId]);
  }
}
