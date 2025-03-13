import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
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
  @Input() parentCommentId: number | null = null;

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
    private userPublicService: UserPublicService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('postId in CommentComponent:', this.postId);

    this.userId = this.userPublicService.getUserId();
    this.loadComments();
  }

  /** ✅ โหลดคอมเมนต์และจัดโครงสร้าง Nested */
  loadComments(): void {
    this.commentService.getCommentsByPost(this.postId).subscribe((comments) => {
      this.comments = [...comments]; 
      this.organizeComments();
      this.cdr.detectChanges();
      
      console.log("📌 โหลดคอมเมนต์ใหม่ สำเร็จ:", this.comments);
    });
  }

  /** ✅ แยก Parent Comments และ Replies */
  private organizeComments(): void {
    this.parentComments = this.comments.filter((comment) => !comment.parentComment);
    this.repliesMap = {};

    this.comments.forEach((comment) => {
      if (comment.parentComment && comment.parentComment.id) {
        if (!this.repliesMap[comment.parentComment.id]) {
          this.repliesMap[comment.parentComment.id] = [];
        }
        this.repliesMap[comment.parentComment.id].push(comment);
      }
    });

    console.log("📌 Replies Map อัปเดตแล้ว:", this.repliesMap);
  }

  /** ✅ เช็คระดับความลึกของคอมเมนต์ (Max 3 ชั้น) */
  getCommentDepth(comment: Comment): number {
    let depth = 1;
    let currentComment = comment;

    while (currentComment.parentComment && currentComment.parentComment.id) {
      depth++;
      currentComment = currentComment.parentComment;
      if (depth > 3) break;  
    }
    return depth;
  }

  /** ✅ เริ่มตอบกลับ (รองรับได้ทุกระดับ) */
  startReply(commentId: number): void {
    console.log("📌 กำลังตอบกลับคอมเมนต์ ID:", commentId);
    this.replyingToCommentId = commentId;
    this.cdr.detectChanges();
  }

  /** ✅ ยกเลิกตอบกลับ */
  stopReply(): void {
    this.replyingToCommentId = null;
  }

  /** ✅ เริ่มแก้ไข */
  startEdit(comment: Comment): void {
    this.editingCommentId = comment.id;
    this.editedMessage = comment.message;
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
          this.loadComments(); 
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