import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { InputCommentComponent } from '../input-comment/input-comment.component';
import { CommentService } from '../../services/auth/comment/comment.service';
import { Comment } from '../../type';
import { UserPublicService } from '../../services/userPublic/userPublic.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule, InputCommentComponent],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  @Input() postId: number = 0;
  @Input() parentCommentId: number | null = null; // ✅ รองรับการแสดงคอมเมนต์ซ้อน

  @Output() commentAdded = new EventEmitter<void>();
  @Output() commentDeleted = new EventEmitter<void>();

  comments: Comment[] = [];         
  parentComments: Comment[] = [];   
  repliesMap: { [key: number]: Comment[] } = {}; 

  replyingToCommentId: number | null = null;
  editingCommentId: number | null = null;
  editedMessage: string = '';
  userId: number = 0;
  
  constructor(private commentService: CommentService, private userPublicService: UserPublicService) { }

  ngOnInit(): void {
    this.userId = this.userPublicService.getUserId(); // ✅ ดึง userId ของผู้ใช้ที่ล็อกอิน
    this.loadComments();
  }

  /**
   * โหลดคอมเมนต์ของ `postId` และ `parentCommentId`
   */
  loadComments(): void {
    this.commentService.getCommentsByPost(this.postId).subscribe((comments) => {
      this.comments = comments;
      this.organizeComments();
    });
  }

  /**
   * แยก Parent Comments กับ Replies
   */
  private organizeComments(): void {
    this.parentComments = this.comments.filter((comment) => !comment.parentComment);
    this.repliesMap = {};

    this.comments.forEach((comment) => {
      if (comment.parentComment) {
        const parentId = comment.parentComment.id;
        if (!this.repliesMap[parentId]) {
          this.repliesMap[parentId] = [];
        }
        this.repliesMap[parentId].push(comment);
      }
    });
  }

  startReply(commentId: number): void {
    this.replyingToCommentId = commentId;
  }

  stopReply(): void {
    this.replyingToCommentId = null;
  }

  startEdit(comment: Comment): void {
    this.editingCommentId = comment.id;
    this.editedMessage = comment.message;
  }

  stopEdit(): void {
    this.editingCommentId = null;
    this.editedMessage = '';
  }

  saveEdit(comment: Comment): void {
    if (this.editedMessage.trim()) {
      const updatedComment: Comment = {
        ...comment,
        message: this.editedMessage,
      };
      this.commentService.updateComment(comment.id, updatedComment).subscribe(() => {
        this.loadComments();
        this.stopEdit();
      });
    }
  }

  deleteComment(commentId: number): void {
    Swal.fire({
      title: 'ยืนยันการลบคอมเมนต์?',
      text: 'คุณต้องการลบคอมเมนต์นี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบเลย!',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentService.deleteComment(commentId).subscribe(() => {
          Swal.fire('ลบสำเร็จ!', 'คอมเมนต์ของคุณถูกลบแล้ว', 'success');
          this.loadComments();
          this.commentDeleted.emit();
        });
      }
    });
  }

  onCommentAddedFromChild(): void {
    this.loadComments();
    this.stopReply();
    this.commentAdded.emit();
  }
}
