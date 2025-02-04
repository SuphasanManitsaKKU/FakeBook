import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { PostService } from '../../services/auth/post/post.service';
import { UserPublicService } from './../../services/userPublic/userPublic.service';
import { PostDTO } from '../../type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-post',
  imports: [CommonModule, FormsModule],
  templateUrl: './input-post.component.html',
  styleUrls: ['./input-post.component.css']
})
export class InputPostComponent implements OnInit {
  isModalOpen: boolean = false;
  postContent: string = '';
  userId: number = 0;

  @Output() postCreated = new EventEmitter<void>();

  // ⭐ เพิ่ม ViewChild เพื่อติดตาม `<input>` ใน Template
  @ViewChild('postContentInput') postContentInput!: ElementRef<HTMLInputElement>;

  constructor(
    private postService: PostService,
    private userPublicService: UserPublicService
  ) {}

  ngOnInit(): void {
    this.userId = this.userPublicService.getUserId();
  }

  openModal() {
    this.isModalOpen = true;
    // ⭐ ใช้ setTimeout เพื่อให้ DOM อัปเดตแล้วค่อย focus
    setTimeout(() => {
      this.postContentInput.nativeElement.focus();
    }, 1);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  post() {
    if (!this.postContent.trim()) return;

    const postDTO: PostDTO = {
      content: this.postContent,
      userId: this.userId
    };

    this.postService.createPost(postDTO).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'โพสต์สำเร็จ!',
          text: 'โพสต์ของคุณได้ถูกสร้างเรียบร้อยแล้ว'
        });
        this.closeModal();
        this.postCreated.emit();
        this.postContent = '';
      },
      () => {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถโพสต์ได้ โปรดลองใหม่อีกครั้ง'
        });
      }
    );
  }
}
