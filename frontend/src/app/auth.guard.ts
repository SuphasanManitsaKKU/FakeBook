import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // ใช้ Dependency Injection เพื่อเรียก Router

  const getToken = (): string | null => {
    const name = 'token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    console.log('decodedCookie:', decodedCookie); // Debugging: ดูค่าของ Cookie
  
    const ca = decodedCookie.split(';');
    console.log('ca:', ca); // Debugging: ดูค่าของ ca
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length); // คืนค่าหลัง "token="
      }
    }
    return null;
  };
  

  const token = getToken();
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp > currentTime) {
        return true;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  console.warn('No valid JWT token found, redirecting to /login');
  router.navigate(['/login']); // เปลี่ยนเส้นทางไปยัง /login
  return false;
};
