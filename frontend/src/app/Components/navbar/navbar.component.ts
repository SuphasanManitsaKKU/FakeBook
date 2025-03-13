import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';  // ✅ Import Subscription

import { NotificationComponent } from '../notification/notification.component';
import { LogoutComponent } from '../logout/logout.component';
import { SearchComponent } from '../search/search.component';

import { UserPublicService } from '../../services/userPublic/userPublic.service';
import { UserService } from '../../services/auth/user/user.service'; 

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../type';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    SearchComponent,
    NotificationComponent,
    LogoutComponent,
    CommonModule,
    FormsModule,
    FontAwesomeModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {  // ✅ Implement OnDestroy
  faCommentDots = faCommentDots;
  isProfileMenuOpen = false;
  userData: User | undefined;
  private userSubscription!: Subscription;  // ✅ ใช้ Subscription เพื่อ unsubscribe ภายหลัง

  constructor(
    private router: Router,
    private userPublicService: UserPublicService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // ✅ Subscribe เพื่อติดตามการเปลี่ยนแปลงของ userId
    this.userSubscription = this.userPublicService.getUserIdObservable().subscribe(userId => {
      if (userId) {
        console.log("✅ userId เปลี่ยน:", userId);
        this.fetchUserData(userId);
      }
    });

    // ✅ โหลดข้อมูลเริ่มต้น
    const userId = this.userPublicService.getUserId();
    if (userId) {
      this.fetchUserData(userId);
    }
  }

  /** ✅ ฟังก์ชันโหลดข้อมูลผู้ใช้ */
  private fetchUserData(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (res) => {
        this.userData = res;
        console.log('✅ โหลดข้อมูล user สำเร็จ:', this.userData);
      },
      error: (err) => console.error('❌ โหลดข้อมูล user ล้มเหลว:', err)
    });
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  goToProfile() {
    this.isProfileMenuOpen = false;
    const userId = this.userPublicService.getUserId();
    if (userId) {
      this.router.navigate(['/user', userId]);
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToChat() {
    this.router.navigate(['/chat']);
  }

  /** ✅ Unsubscribe เมื่อ Component ถูกทำลาย */
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}