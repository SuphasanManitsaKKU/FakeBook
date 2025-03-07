import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { PostService } from '../../services/auth/post/post.service';
import { UserPublicService } from './../../services/userPublic/userPublic.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-input-post',
  imports: [CommonModule, FormsModule],
  templateUrl: './input-post.component.html',
  styleUrls: ['./input-post.component.css']
})
export class InputPostComponent implements OnInit {
  @Output() postCreated = new EventEmitter<void>();
  @ViewChild('postContentInput') postContentInput!: ElementRef<HTMLInputElement>;

  isModalOpen = false;
  isPosting = false;
  postContent = '';
  userId = 0;

  constructor(
    private postService: PostService,
    private userPublicService: UserPublicService
  ) {}

  ngOnInit(): void {
    this.userId = this.userPublicService.getUserId();
  }

  openModal(): void {
    this.isModalOpen = true;
    setTimeout(() => this.postContentInput?.nativeElement.focus(), 1);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.postContent = ''; // ✅ ล้างค่าเมื่อปิด Modal
  }

  async post(event?: Event): Promise<void> {
    event?.preventDefault(); // ✅ ป้องกัน Default Form Submit

    if (this.isPosting || !this.postContent.trim()) return;
    this.isPosting = true;

    try {
      await firstValueFrom(this.postService.createPost({ content: this.postContent, userId: this.userId }));

      Swal.fire({
        icon: 'success',
        title: 'โพสต์สำเร็จ!',
        text: 'โพสต์ของคุณถูกสร้างแล้ว',
        timer: 1500,
        showConfirmButton: false
      });

      this.closeModal();
      this.postCreated.emit();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถโพสต์ได้ โปรดลองใหม่อีกครั้ง'
      });
      console.error('❌ Error posting:', error);
    } finally {
      this.isPosting = false;
    }
  }
}