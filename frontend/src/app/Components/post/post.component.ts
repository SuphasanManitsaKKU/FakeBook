import { UserService } from './../../services/user/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { Post, Comment } from '../../type';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post',
  imports: [CommonModule, CommentComponent, FormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})

export class PostComponent implements OnInit {
  @Input() post: Post = { id: 0, content: '', likeAmount: 0, commentAmount: 0, shareAmount: 0, userId: 0, comments: [] };
  newComment: string = '';

  constructor(private authService: AuthService,private userService: UserService) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.authService.getComments(this.post.id).subscribe(comments => {
      this.post.comments = comments;
    });
  }

  createComment(): void {
    const comment: Comment = { id: 0, message: this.newComment, postId: this.post.id, userId: this.userService.getUserId() };
    this.authService.createComment(this.post.id, comment).subscribe(newComment => {
      this.post.comments.unshift(newComment);
      this.newComment = '';
    });
  }
}