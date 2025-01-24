import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  constructor(private userService: UserService,private router: Router) { }
  logout() {
    // ลบ Cookie (วิธีการลบ Cookie)
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    // เปลี่ยนเส้นทางกลับไปที่หน้า Login
    this.router.navigate(['/login']);
  }
}
