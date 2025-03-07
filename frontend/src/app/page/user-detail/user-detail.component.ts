import { UserPublicService } from './../../services/userPublic/userPublic.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/auth/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedUserComponent } from '../../Components/feed-user/feed-user.component';
import { User } from '../../type';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, FeedUserComponent],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  userId: number | null = null;
  loggedInUserId: number | null = null;
  userData: any = null;
  isEditing = false;
  isOwner = false;
  editData: User = {
    id: 0,
    email: '',
    username: '',
    password: '',
    imageProfile: null,
    coverImage: null,
    bio: null,
    gender: null,
    birthday: null,
    location: null
  };
  selectedProfileImage: File | null = null;
  selectedCoverImage: File | null = null;

  constructor(private route: ActivatedRoute, private userService: UserService, private userPublicService: UserPublicService, private router: Router,) { }

  ngOnInit(): void {
    this.loggedInUserId = this.userPublicService.getUserId();
    this.userId = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : this.loggedInUserId;
    this.isOwner = this.userId == this.loggedInUserId;
    this.loadUserProfile();
  }

  /** ✅ โหลดข้อมูลโปรไฟล์ */
  loadUserProfile(): void {
    this.userService.getUserById(this.userId!).subscribe({
      next: (user) => {
        this.userData = user;
        this.editData = { ...user };
      },
      error: (err) => console.error('โหลดข้อมูลล้มเหลว:', err)
    });
  }

  /** ✅ เปิด/ปิดโหมดแก้ไข */
  toggleEditMode(): void {
    if (!this.isOwner) return;
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      // ✅ คัดลอกค่าปัจจุบันไปที่ editData
      this.editData = { ...this.userData };
    } else {
      // ✅ รีเซ็ตค่าถ้ากดยกเลิก
      this.selectedProfileImage = null;
      this.selectedCoverImage = null;
    }
  }

  /** ✅ เมื่อเลือกไฟล์ Cover */
  onCoverImageChange(event: any): void {
    if (!this.isOwner || !event.target.files.length) return;
    const file = event.target.files[0];
    if (!file) return;
    this.selectedCoverImage = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.userData.coverImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /** ✅ เมื่อเลือกไฟล์โปรไฟล์ */
  onProfileImageChange(event: any): void {
    if (!this.isOwner || !event.target.files.length) return;
    const file = event.target.files[0];
    if (!file) return;
    this.selectedProfileImage = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.userData.imageProfile = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /** ✅ บันทึกข้อมูลโปรไฟล์ */
  async saveProfile(): Promise<void> {
    console.log('🚀 กำลังบันทึกข้อมูลโปรไฟล์...');

    if (!this.isOwner) return;

    const updatedUser: User = {
      id: this.loggedInUserId!,
      username: this.editData.username,
      bio: this.editData.bio,
      gender: this.editData.gender,
      location: this.editData.location,
      birthday: this.editData.birthday,
      email: '',
      password: '',
      imageProfile: null,
      coverImage: null
    };

    try {
      await firstValueFrom(this.userService.updateUserProfile(this.userId!, updatedUser));

      // ✅ Upload Profile Image ก่อน
      if (this.selectedProfileImage) {
        console.log('📤 Uploading profile image...');
        await firstValueFrom(this.userService.uploadProfileImage(this.userId!, this.selectedProfileImage));
      }

      // ✅ Upload Cover Image หลังจากนั้น
      if (this.selectedCoverImage) {
        console.log('📤 Uploading cover image...');
        await firstValueFrom(this.userService.uploadCoverImage(this.userId!, this.selectedCoverImage));
      }

      // ✅ โหลดข้อมูลใหม่
      setTimeout(() => this.loadUserProfile(), 1000);

      Swal.fire({
        title: 'บันทึกข้อมูลสำเร็จ!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      window.location.reload();

    } catch (err) {
      console.error('❌ บันทึกข้อมูลล้มเหลว:', err);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกโปรไฟล์ได้',
        icon: 'error',
      });
    }
  }

  goToHHome() {
    this.router.navigate(['/']);
  }
}
