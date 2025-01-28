import { Component, OnInit } from '@angular/core';
import { Post } from '../../type';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  newPostContent: string = '';

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.authService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  createPost(): void {
    const post = { id: 0, content: this.newPostContent, likeAmount: 0, commentAmount: 0, shareAmount: 0, userId: this.userService.getUserId(), comments: [] };
    this.authService.createPost(post).subscribe(newPost => {
      this.posts.unshift(newPost); // Add new post to the top
      this.newPostContent = ''; // Clear the input
    });
  }
}