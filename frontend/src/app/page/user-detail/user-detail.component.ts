import { UserPublicService } from './../../services/userPublic/userPublic.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/auth/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedUserComponent } from '../../Components/feed-user/feed-user.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, FeedUserComponent],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  userId: number | null = null;
  userData: any = null;
  isEditing = false;
  editData: any = {};

  constructor(private route: ActivatedRoute, private userService: UserService, private userPublicService: UserPublicService) { }

  ngOnInit(): void {
    this.userId = this.userPublicService.getUserId();
    this.loadUserProfile();
  }

  /** ✅ โหลดข้อมูลโปรไฟล์ */
  loadUserProfile(): void {
    this.userService.getUserById(this.userId!).subscribe({
      next: (user) => {
        this.userData = user;
        this.editData = { ...user }; // ก๊อบปี้ข้อมูลไปแก้ไข
      },
      error: (err) => console.error('โหลดข้อมูลล้มเหลว:', err)
    });
  }

  /** ✅ เปิด/ปิดโหมดแก้ไข */
  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
  }

  /** ✅ บันทึกการแก้ไขโปรไฟล์ */
  saveProfile(): void {
    console.log('🔹 Sending update request:', this.editData); // Debug JSON ที่ส่งไป

    this.userService.updateUserProfile(this.userId!, this.editData).subscribe({
      next: () => {
        this.isEditing = false;
        this.loadUserProfile(); // โหลดข้อมูลใหม่
      },
      error: (err) => console.error('บันทึกข้อมูลล้มเหลว:', err)
    });
  }


  /** ✅ เปลี่ยน Cover Image (แสดงภาพใหม่ + เก็บ path) */
  onCoverImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const path = `assets/uploads/${file.name}`;
      this.editData.coverImage = path;

      // ✅ แสดงรูปใหม่ทันที
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userData.coverImage = e.target.result; // อัปเดต UI ทันที
      };
      reader.readAsDataURL(file);
    }
  }

  /** ✅ เปลี่ยน Profile Image (แสดงภาพใหม่ + เก็บ path) */
  onProfileImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const path = `assets/uploads/${file.name}`;
      this.editData.imageProfile = path;

      // ✅ แสดงรูปใหม่ทันที
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userData.imageProfile = e.target.result; // อัปเดต UI ทันที
      };
      reader.readAsDataURL(file);
    }
  }

}
