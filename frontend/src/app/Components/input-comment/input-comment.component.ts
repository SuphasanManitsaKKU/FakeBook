import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CommentRequestDTO } from '../../type'; 
import { CommentService } from '../../services/auth/comment/comment.service';
import { UserPublicService } from '../../services/userPublic/userPublic.service';

@Component({
  selector: 'app-input-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-comment.component.html',
  styleUrls: ['./input-comment.component.css'],
})
export class InputCommentComponent {
  @Input() postId: number = 0;
  @Input() parentCommentId: number | null = null;

  @Output() commentAdded = new EventEmitter<void>();

  commentMessage: string = '';
  isSubmitting: boolean = false; // ป้องกันการกดซ้ำ

  constructor(
    private commentService: CommentService,
    private userPublicService: UserPublicService
  ) {}

  addComment(): void {
    if (!this.commentMessage.trim()) {
      console.warn('Cannot post an empty comment.');
      return;
    }

    this.isSubmitting = true;

    const commentRequest: CommentRequestDTO = {
      postId: this.postId,
      message: this.commentMessage,
      userId: this.userPublicService.getUserId(), // ดึง userId จาก service ของคุณ
      parentCommentId: this.parentCommentId,
    };

    this.commentService.createComment(commentRequest).subscribe({
      next: () => {
        this.commentMessage = '';
        console.log('Comment posted successfully');
        this.commentAdded.emit(); // ส่ง event กลับไปยังพาเรนต์ (หรือ comment.component)
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Failed to post comment:', err);
        this.isSubmitting = false;
      },
    });
  }
}
