import { UserPublicService } from './../../services/userPublic/userPublic.service';
import { ShareService } from './../../services/auth/share/share.service';
import { PostService } from './../../services/auth/post/post.service';  // ✅ Import PostService
import { Component, OnInit } from '@angular/core';
import { PostComponent } from '../post/post.component';
import { PostResponseDTO } from '../../type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feed-user',
  imports: [PostComponent, CommonModule, FormsModule],
  templateUrl: './feed-user.component.html',
  styleUrl: './feed-user.component.css'
})
export class FeedUserComponent implements OnInit {
  posts: PostResponseDTO[] = [];  
  userId: number = 0;  

  constructor(
    private shareService: ShareService, 
    private userPublicService: UserPublicService,
    private postService: PostService // ✅ เพิ่ม PostService
  ) {}

  ngOnInit(): void {
    this.userId = this.userPublicService.getUserId();
    this.loadFeed();
  }

  /** ✅ โหลดโพสต์ของตัวเอง + โพสต์ที่แชร์ */
  loadFeed(): void {
    let sharedPosts: PostResponseDTO[] = [];
    let userPosts: PostResponseDTO[] = [];

    // 📌 ดึงโพสต์ที่แชร์
    this.shareService.getSharedPostsByUser(this.userId).subscribe((posts) => {
      sharedPosts = posts;
      this.combineAndSortPosts(sharedPosts, userPosts);
    });

    // 📌 ดึงโพสต์ของตัวเอง
    this.postService.getPostsByUser(this.userId).subscribe((posts) => {
      userPosts = posts;
      this.combineAndSortPosts(sharedPosts, userPosts);
    });
  }

  /** ✅ รวมโพสต์ + เรียงลำดับล่าสุดก่อน */
  private combineAndSortPosts(shared: PostResponseDTO[], user: PostResponseDTO[]): void {
    this.posts = [...shared, ...user].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  onPostCreated(): void {
    this.loadFeed(); 
  }

  onPostDeleted(postId: number): void {
    this.posts = this.posts.filter(post => post.id !== postId);
  }
}