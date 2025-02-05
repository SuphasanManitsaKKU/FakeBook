import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; 

import { PostService } from '../../services/auth/post/post.service';
import { LikeService } from '../../services/auth/like/like.service';
import { ShareService } from '../../services/auth/share/share.service';
import { UserPublicService } from '../../services/userPublic/userPublic.service';

import { PostDTO, PostResponseDTO } from '../../type'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentComponent } from '../comment/comment.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule, CommentComponent],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() postId: number = 0;
  @Output() postDeleted = new EventEmitter<number>();

  post: PostResponseDTO | null = null;
  userId: number = 0;

  showComments: boolean = false;
  showShareOptions: boolean = false;
  showPostMenu: boolean = false;
  
  editing: boolean = false;
  editedContent: string = '';

  constructor(
    private postService: PostService,
    private likeService: LikeService,
    private shareService: ShareService,
    private userPublicService: UserPublicService,
    private router: Router, 
  ) {}

  ngOnInit(): void {
    this.userId = this.userPublicService.getUserId();
    if (this.postId) {
      this.loadPost();
    }
  }

  loadPost(): void {
    this.postService.getPostById(this.postId).subscribe((postResponse: PostResponseDTO) => {
      this.post = postResponse;
      this.editedContent = this.post.content;
    });
  }

  navigateToUser(): void {
    // นำทางไปโปรไฟล์ผู้โพสต์ (หรือจะเปลี่ยนไป userId อื่นก็ได้)
    if (!this.userId) {
      console.error("User ID ไม่ถูกต้อง");
      return;
    }
    this.router.navigate(['/user', this.userId]);
  }

  startEdit(): void {
    this.editing = true;
    this.editedContent = this.post?.content ?? '';
  }

  cancelEdit(): void {
    this.editing = false;
  }

  saveEdit(): void {
    if (!this.post) return;

    const updatedPost: PostDTO = {
      content: this.editedContent,
      userId: this.post.user.id
    };

    this.postService.updatePost(this.post.id, updatedPost).subscribe({
      next: (updatedResponse: PostResponseDTO) => {
        if (this.post?.id === updatedResponse.id) {
          this.post = { ...this.post, ...updatedResponse };
        }
        this.editing = false;

        Swal.fire({
          title: 'บันทึกสำเร็จ!',
          text: 'โพสต์ของคุณถูกอัปเดตแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
      },
      error: () => {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถอัปเดตโพสต์ได้ กรุณาลองใหม่อีกครั้ง',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });
      }
    });
  }

  deletePost(): void {
    if (!this.post) return;

    Swal.fire({
      title: 'ยืนยันการลบโพสต์?',
      text: 'คุณต้องการลบโพสต์นี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบเลย!',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deletePost(this.post!.id).subscribe(() => {
          Swal.fire('ลบสำเร็จ!', 'โพสต์ของคุณถูกลบแล้ว', 'success');
          this.postDeleted.emit(this.postId); // แจ้งไป Component แม่ (ถ้ามี)
        });
      }
    });
  }

  toggleLike(): void {
    if (!this.post) return;
    this.likeService.toggleLike(this.post.user.id, this.post.id).subscribe((updatedPost: PostResponseDTO) => {
      this.post = updatedPost;
    });
  }

  toggleComments(): void {
    this.showComments = !this.showComments;
  }

  toggleShareOptions(): void {
    this.showShareOptions = !this.showShareOptions;
  }

  copyLink(): void {
    if (!this.post) return;
    const postUrl = `http://localhost:4200/post/${this.post.id}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      Swal.fire('คัดลอกลิงก์แล้ว!', 'คุณสามารถแชร์ลิงก์นี้ให้เพื่อนได้เลย', 'success');
      this.showShareOptions = false;
    }).catch(() => {
      Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถคัดลอกลิงก์ได้', 'error');
    });
  }

  shareToFeed(): void {
    if (!this.post) return;
    this.shareService.sharePost(this.userId, this.post.id).subscribe(() => {
      Swal.fire('แชร์สำเร็จ!', 'โพสต์ของคุณถูกแชร์ไปยัง Feed แล้ว', 'success');
      this.showShareOptions = false;
      this.loadPost();
    });
  }

  togglePostMenu(): void {
    this.showPostMenu = !this.showPostMenu;
  }

  /**
   * เมื่อคอมเมนต์ถูกเพิ่ม (จับ event commentAdded จาก <app-comment>)
   * จะเข้ามาทำงานในฟังก์ชันนี้
   */
  onCommentChange() {
    console.log('PostComponent: comment was added! กำลังโหลดโพสต์ใหม่...');
    this.loadPost(); // โหลดข้อมูลโพสต์ใหม่ เพื่ออัปเดต commentAmount เป็นต้น
  }
}
