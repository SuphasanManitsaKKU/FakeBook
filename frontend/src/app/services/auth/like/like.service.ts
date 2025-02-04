import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostResponseDTO } from '../../../type';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  private baseUrl = 'http://localhost:8080/api/likes';  // Base URL for the LikeController

  constructor(private http: HttpClient) { }

  // Toggle like (add or remove like based on current state)
  toggleLike(userId: number, postId: number): Observable<PostResponseDTO> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('postId', postId.toString());

    return this.http.post<PostResponseDTO>(`${this.baseUrl}/toggle`, null, { params, withCredentials: true });
  }
}
