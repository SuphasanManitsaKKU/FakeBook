import { UserService } from './../../services/user/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Comment } from '../../type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment',
  imports: [CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() postId: number = 0;
  comments: Comment[] = [];
  newCommentMessage: string = '';

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments() {
    this.authService.getComments(this.postId).subscribe((data) => {
      this.comments = data as Comment[];  // Type assertion to Comment[]
    });
  }


  createComment() {
    const newComment: Comment = { id: 0, message: this.newCommentMessage, postId: this.postId, userId: this.userService.getUserId() };
    this.authService.createComment(newComment).subscribe(() => {
      this.loadComments();
      this.newCommentMessage = '';
    });
  }
}
