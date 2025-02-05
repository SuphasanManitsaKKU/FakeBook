import { UserPublicService } from './../../services/userPublic/userPublic.service';
import { Component, OnInit } from '@angular/core';
import { InputPostComponent } from '../input-post/input-post.component';
import { PostComponent } from '../post/post.component';
import { PostService } from '../../services/auth/post/post.service';
import { PostResponseDTO } from '../../type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feed-home',
  imports: [PostComponent, InputPostComponent, CommonModule, FormsModule],
  templateUrl: './feed-home.component.html',
  styleUrls: ['./feed-home.component.css']
})
export class FeedHomeComponent implements OnInit {
  posts: PostResponseDTO[] = [];  // ✅ เก็บโพสต์ทั้งหมด
  userId: number = 0; // ✅ ตัวอย่าง userId (เปลี่ยนเป็นค่า dynamic)

  constructor(private postService: PostService, private userPublicService: UserPublicService) { }

  ngOnInit(): void {
    this.userId = this.userPublicService.getUserId(); // ✅ ดึง userId ของผู้ใช้ที่ล็อกอิน
    this.loadFeed();
  }

  /** ✅ โหลดโพสต์ของเราและเพื่อน */
  loadFeed(): void {
    this.postService.getUserAndFriendsPosts(this.userId).subscribe((posts) => {
      this.posts = posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    });
  }

  /** ✅ อัปเดต Feed เมื่อมีโพสต์ใหม่ */
  onPostCreated(): void {
    this.loadFeed(); // โหลดโพสต์ใหม่ทั้งหมด
  }

  onPostDeleted(postId: number): void {
    this.posts = this.posts.filter(post => post.id !== postId);
  }

}
