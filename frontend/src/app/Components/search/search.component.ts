import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  username: string = '';
  users: any[] = [];
  loading: boolean = false;
  error: string | null = null; // เพิ่ม error สำหรับการจัดการข้อผิดพลาด

  constructor(private http: HttpClient, private router: Router) {}

  searchUsers(): void {
    this.loading = true;
    this.error = null; // ล้างข้อผิดพลาดก่อนการค้นหา

    this.http.get<any[]>(`http://localhost:8080/api/users/search`, {
      params: { username: this.username },
      withCredentials: true, // เปิดใช้งานการส่ง Cookie
    })
      .subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'เกิดข้อผิดพลาดในการค้นหา';
          this.loading = false;
        }
      });
  }
  navigateToUser(userId: number): void {
    this.router.navigate(['/user', userId]); // นำทางไปยัง /user/{id}
  }
}
