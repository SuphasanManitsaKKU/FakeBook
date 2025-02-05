import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserPublicService } from './services/userPublic/userPublic.service'; 

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userPublicService = inject(UserPublicService);

  console.log("Hello from authGuard");

  const getToken = (): string | null => {
    try {
      const name = 'token=';
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return null;
    } catch (error) {
      console.error('Error retrieving token:', error);
      router.navigate(['/login']);
      return null;
    }
  };

  const token = getToken();
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp > currentTime) {
        console.log('Setting user info:', payload.userId, payload.sub);
        
        userPublicService.setUserInfo(payload.userId, payload.sub);
        console.log('User ID stored in service:', userPublicService.getUserId());

        return true;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      router.navigate(['/login']);
    }
  }

  console.warn('No valid JWT token found, redirecting to /login');
  router.navigate(['/login']);
  return false;
};
