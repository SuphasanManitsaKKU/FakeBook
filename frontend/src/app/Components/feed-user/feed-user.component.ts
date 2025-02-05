import { UserPublicService } from './../../services/userPublic/userPublic.service';
import { ShareService } from './../../services/auth/share/share.service';
import { Component, OnInit } from '@angular/core';
import { InputPostComponent } from '../input-post/input-post.component';
import { PostComponent } from '../post/post.component';
import { PostResponseDTO } from '../../type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feed-user',
  imports: [PostComponent, InputPostComponent, CommonModule, FormsModule],
  templateUrl: './feed-user.component.html',
  styleUrl: './feed-user.component.css'
})
export class FeedUserComponent {
  posts: PostResponseDTO[] = [];  // ✅ เก็บโพสต์ทั้งหมด
  userId: number = 0; // ✅ ตัวอย่าง userId (เปลี่ยนเป็นค่า dynamic)

  constructor(private shareService: ShareService, private userPublicService: UserPublicService) { }

  ngOnInit(): void {
    this.userId = this.userPublicService.getUserId();
    this.loadFeed();
  }

  /** ✅ โหลดโพสต์ของเราและเพื่อน */
  loadFeed(): void {
    this.shareService.getSharedPostsByUser(this.userId).subscribe((posts) => {
      this.posts = posts;
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
