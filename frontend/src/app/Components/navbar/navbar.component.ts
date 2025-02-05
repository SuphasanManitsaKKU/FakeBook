import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NotificationComponent } from '../notification/notification.component';
import { LogoutComponent } from '../logout/logout.component';
import { SearchComponent } from '../search/search.component';

import { UserPublicService } from '../../services/userPublic/userPublic.service';
import { UserService } from '../../services/auth/user/user.service'; 
// ↑ Inject UserService เพื่อเรียก getUserById()

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    SearchComponent,
    NotificationComponent,
    LogoutComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  // ควบคุมการเปิด/ปิดเมนูของโปรไฟล์
  isProfileMenuOpen = false;

  // ⭐ เก็บข้อมูลผู้ใช้ (ถ้ามี interface User ก็ใช้ User | null)
  userData: any = null;

  constructor(
    private router: Router,
    private userPublicService: UserPublicService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // 1) ดึง userId จาก UserPublicService (หรือจะใช้ token ตรวจจับอื่นๆ ตามโปรเจกต์)
    const userId = this.userPublicService.getUserId();
    
    // 2) ถ้ามี userId ก็เรียก getUserById เพื่อโหลดข้อมูลผู้ใช้ (รวมถึงรูปโปรไฟล์)
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (res) => {
          this.userData = res;  // เก็บข้อมูลผู้ใช้
          console.log('ข้อมูล user', this.userData);
        },
        error: (err) => {
          console.error('เกิดข้อผิดพลาดขณะดึงข้อมูลผู้ใช้', err);
        }
      });
    }
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  /** กดดูโปรไฟล์ => ไปหน้า /user-detail/[id] */
  goToProfile() {
    console.log('ไปหน้าโปรไฟล์');
    
    this.isProfileMenuOpen = false;
    const userId = this.userPublicService.getUserId();
    if (userId) {
      this.router.navigate(['/user', userId]);
    }
  }

  goToHome() {
    this.router.navigate(['/']);  // ✅ นำทางไปหน้า Home
  }

  goToChat() {
    this.router.navigate(['/chat']);  // ✅ ไปที่หน้าแชท
  }  
  
}
