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

  constructor(
    private commentService: CommentService,
    private userPublicService: UserPublicService
  ) { }

  ngOnInit(): void {
    console.log('postId in PostComponent:', this.postId);

    this.userId = this.userPublicService.getUserId();
    this.loadComments();
  }

  /** ✅ โหลดคอมเมนต์และจัดเก็บโครงสร้างคอมเมนต์ Nested */
  loadComments(): void {
    this.commentService.getCommentsByPost(this.postId).subscribe((comments) => {
      this.comments = comments;
      this.organizeComments(); // ✅ แยก Parent และ Replies
    });
  }

  /** ✅ แยก Parent Comments และ Replies */
  private organizeComments(): void {
    this.parentComments = this.comments.filter((comment) => !comment.parentComment);
    this.repliesMap = {};

    this.comments.forEach((comment) => {
      if (comment.parentComment) {
        if (!this.repliesMap[comment.parentComment.id]) {
          this.repliesMap[comment.parentComment.id] = [];
        }
        this.repliesMap[comment.parentComment.id].push(comment);
      }
    });
  }

  /** ✅ เช็คระดับความลึกของคอมเมนต์ (Max 3 ชั้น) */
  getCommentDepth(comment: Comment): number {
    let depth = 1;
    while (comment.parentComment) {
      depth++;
      comment = comment.parentComment;
    }
    return depth;
  }

  /** ✅ เริ่มตอบกลับ */
  startReply(commentId: number): void {
    this.replyingToCommentId = commentId;
  }

  /** ✅ ยกเลิกตอบกลับ */
  stopReply(): void {
    this.replyingToCommentId = null;
  }

  /** ✅ เริ่มแก้ไข */
  startEdit(comment: Comment): void {
    this.editingCommentId = comment.id;
    this.editedMessage = comment.message; // โหลดค่าปัจจุบันมาแสดง
  }

  /** ✅ ยกเลิกแก้ไข */
  stopEdit(): void {
    this.editingCommentId = null;
    this.editedMessage = '';
  }

  /** ✅ บันทึกการแก้ไข */
  saveEdit(comment: Comment): void {
    if (this.editedMessage.trim()) {
      const updatedComment: Comment = { ...comment, message: this.editedMessage };

      this.commentService.updateComment(comment.id, updatedComment).subscribe(
        () => {
          this.loadComments(); // โหลดคอมเมนต์ใหม่หลังแก้ไข
          this.stopEdit();
        },
        (error) => {
          console.error('เกิดข้อผิดพลาด:', error);
        }
      );
    }
  }

  /** ✅ ลบคอมเมนต์ */
  deleteComment(commentId: number): void {
    Swal.fire({
      title: 'Confirm Comment Deletion?',
      text: 'Are you sure you want to delete this comment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentService.deleteComment(commentId).subscribe(() => {
          Swal.fire('Deleted!', 'Your comment has been deleted.', 'success');
          this.loadComments();
        });
      }
    });
  }

  /** ✅ โหลดคอมเมนต์ใหม่หลังจากตอบกลับ */
  onCommentAddedFromChild(): void {
    this.loadComments();
    this.stopReply();
  }
}