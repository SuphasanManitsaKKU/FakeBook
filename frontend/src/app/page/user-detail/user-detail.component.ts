import { UserPublicService } from './../../services/userPublic/userPublic.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/auth/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedUserComponent } from '../../Components/feed-user/feed-user.component';
import { User } from '../../type';
import Swal from 'sweetalert2';

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
    if (!this.isEditing) {
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
  saveProfile(): void {
    if (!this.isOwner) return;

    const updatedUser: User = {
      username: this.editData.username,
      bio: this.editData.bio,
      gender: this.editData.gender,
      location: this.editData.location,
      birthday: this.editData.birthday,
      id: this.loggedInUserId!,
      email: '',
      password: '',
      imageProfile: null,
      coverImage: null
    };

    this.userService.updateUserProfile(this.userId!, updatedUser).subscribe({
      next: () => {
        console.log('✅ บันทึกข้อมูลโปรไฟล์สำเร็จ');

        if (this.selectedProfileImage) {
          this.userService.uploadProfileImage(this.userId!, this.selectedProfileImage).subscribe();
        }

        if (this.selectedCoverImage) {
          this.userService.uploadCoverImage(this.userId!, this.selectedCoverImage).subscribe();
        }

        this.isEditing = false;
        this.loadUserProfile();
      },
      error: (err) => console.error('❌ บันทึกข้อมูลล้มเหลว:', err)
    });

    Swal.fire({
      title: 'ส่งคำขอเป็นเพื่อนสำเร็จ!',
      icon: 'success',
      timer: 1500,  // ✅ 1.5 วินาที
      showConfirmButton: false
    }).then(() => {
      window.location.reload();
    });
  }

  goToHHome() {
    this.router.navigate(['/']);
  }
}
