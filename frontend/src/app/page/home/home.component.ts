import { Component, OnInit } from '@angular/core';
import { FriendService } from '../../services/auth/friend/friend.service';
import { UserPublicService } from '../../services/userPublic/userPublic.service';
import { User, FriendRequest } from '../../type';  // <-- Import interface ที่เพิ่งแก้
import { UserService } from '../../services/auth/user/user.service';
import { FeedHomeComponent } from "../../Components/feed-home/feed-home.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-login',
  standalone: true,
  imports: [FeedHomeComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  friendRequests: FriendRequest[] = [];  // sender, receiver เป็น User
  friends: User[] = [];                 // User[]
  allUsers: User[] = [];                // User[]
  userId: number = 0;

  constructor(
    private friendService: FriendService,
    private userPublicService: UserPublicService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // สมมติว่าดึง userId จาก userPublicService
    this.userId = this.userPublicService.getUserId();

    // 1) ดึง friend requests (received pending) => จะได้ sender, receiver เป็น object
    this.friendService.getReceivedPendingRequests(this.userId).subscribe({
      next: (requests) => {
        this.friendRequests = requests;
      },
      error: (err) => console.log(err),
    });

    // 2) ดึง friends
    this.friendService.getAllFriends(this.userId).subscribe({
      next: (myFriends) => {
        this.friends = myFriends;
      },
      error: (err) => console.log(err),
    });

    // 3) ดึง all users
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
      },
      error: (err) => console.log(err),
    });
  }

  acceptFriend(requestId: number) {
    this.friendService.acceptFriendRequest(requestId).subscribe({
      next: (res) => {
        // เมื่อรับเป็นเพื่อนแล้ว ลบ request ออกจาก friendRequests
        this.friendRequests = this.friendRequests.filter(r => r.id !== requestId);

        // แล้วดึงเพื่อนทั้งหมดมาอัปเดต
        this.friendService.getAllFriends(this.userId).subscribe(f => this.friends = f);
      },
      error: (err) => console.log(err),
    });
  }

  rejectFriend(requestId: number) {
    this.friendService.rejectFriendRequest(requestId).subscribe({
      next: (res) => {
        // ลบ request ออกจาก friendRequests
        this.friendRequests = this.friendRequests.filter(r => r.id !== requestId);
      },
      error: (err) => console.log(err),
    });
  }

  goToUserDetail(userId: number) {
    // นำทางไปหน้า /user/:id
    this.router.navigate(['/user', userId]);
  }
}
