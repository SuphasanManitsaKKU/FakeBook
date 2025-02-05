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
  loggedInUserId: number | null = null; // userId ของผู้ใช้ที่ล็อกอิน
  userData: any = null;
  isEditing = false;
  isOwner = false; // ตรวจสอบว่าเป็นเจ้าของโปรไฟล์หรือไม่
  editData: any = {};

  constructor(private route: ActivatedRoute, private userService: UserService, private userPublicService: UserPublicService) { }

  ngOnInit(): void {
    this.loggedInUserId = this.userPublicService.getUserId(); // ดึง userId ของผู้ใช้ที่ล็อกอิน
    this.userId = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : this.loggedInUserId; // ใช้ userId จาก URL หรือจากที่ล็อกอิน

    this.isOwner = this.userId == this.loggedInUserId; // เช็คว่า userId ที่ดูอยู่เป็น userId ของเราเองหรือไม่

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
    if (!this.isOwner) return; // ถ้าไม่ใช่เจ้าของห้ามแก้ไข
    this.isEditing = !this.isEditing;
  }

  /** ✅ บันทึกการแก้ไขโปรไฟล์ */
  saveProfile(): void {
    if (!this.isOwner) return; // ป้องกันการแก้ไขถ้าไม่ใช่เจ้าของ

    console.log('🔹 Sending update request:', this.editData);
    this.userService.updateUserProfile(this.userId!, this.editData).subscribe({
      next: () => {
        this.isEditing = false;
        this.loadUserProfile();
      },
      error: (err) => console.error('บันทึกข้อมูลล้มเหลว:', err)
    });
  }

  /** ✅ เปลี่ยน Cover Image */
  onCoverImageChange(event: any): void {
    if (!this.isOwner) return; // ป้องกันการแก้ไข
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userData.coverImage = e.target.result; // อัปเดต UI ทันที
      };
      reader.readAsDataURL(file);
    }
  }

  /** ✅ เปลี่ยน Profile Image */
  onProfileImageChange(event: any): void {
    if (!this.isOwner) return; // ป้องกันการแก้ไข
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userData.imageProfile = e.target.result; // อัปเดต UI ทันที
      };
      reader.readAsDataURL(file);
    }
  }
}
