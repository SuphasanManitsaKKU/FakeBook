import { Component, OnInit } from '@angular/core';
import { LogoutComponent } from '../../Components/logout/logout.component';
import { SearchComponent } from '../../Components/search/search.component';
import { NotificationComponent } from '../../Components/notification/notification.component';
import { PostComponent } from '../../Components/post/post.component';
import { CommentComponent } from '../../Components/comment/comment.component';
import { Post } from '../../type';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-test-login',
  imports: [LogoutComponent, SearchComponent, NotificationComponent, PostComponent, CommentComponent],
  templateUrl: './test-login.component.html',
  styleUrl: './test-login.component.css'
})
export class TestLoginComponent implements OnInit {
  posts: Post[] = [];  // อาเรย์เก็บโพสต์
  newPostContent: string = '';  // ตัวแปรเก็บเนื้อหาโพสต์ใหม่

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.authService.getPosts().subscribe((data) => {
      this.posts = data;
    });
  }

  createPost() {
    const newPost: Post = { id: 0, content: this.newPostContent };
    this.authService.createPost(newPost).subscribe(() => {
      this.loadPosts();
      this.newPostContent = '';
    });
  }
}