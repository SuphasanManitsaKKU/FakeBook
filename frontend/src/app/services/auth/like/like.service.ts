import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostResponseDTO } from '../../../type';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  private apiUrl = environment.apiUrl; // ใช้ API URL จาก environment.ts

  constructor(private http: HttpClient) { }

  // Toggle like (add or remove like based on current state)
  toggleLike(userId: number, postId: number): Observable<PostResponseDTO> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('postId', postId.toString());

    return this.http.post<PostResponseDTO>(`${this.apiUrl}/likes/toggle`, null, { params, withCredentials: true });
  }
}
