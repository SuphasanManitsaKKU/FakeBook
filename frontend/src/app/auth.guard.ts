import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user/user.service'; // Import AuthService

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // ใช้ Dependency Injection เพื่อเรียก Router
  const userService = inject(UserService); // Inject AuthService

  const getToken = (): string | null => {
    try {
      const name = 'token=';
      const decodedCookie = decodeURIComponent(document.cookie);

      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length); // คืนค่าหลัง "token="
        }
      }
      return null;
    } catch (error) {
      router.navigate(['/login']);
      return null;
    }

  };

  const token = getToken();
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT Payload
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp > currentTime) {
        // เก็บ userId และ username ใน AuthService
        userService.setUserInfo(payload.userId, payload.sub);
        return true;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      router.navigate(['/login']);
    }
  }

  console.warn('No valid JWT token found, redirecting to /login');
  router.navigate(['/login']); // เปลี่ยนเส้นทางไปยัง /login
  return false;
};
