
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostDTO, PostResponseDTO, Post } from '../../../type';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = environment.apiUrl; // ใช้ API URL จาก environment.ts

  constructor(private http: HttpClient) { }

  // ดึงโพสต์ตาม ID
  getPostById(id: number): Observable<PostResponseDTO> {
    return this.http.get<PostResponseDTO>(`${this.apiUrl}/posts/${id}`, { withCredentials: true });
  }

  // สร้างโพสต์ใหม่
  createPost(postDTO: PostDTO): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, postDTO, { withCredentials: true });
  }

  // อัพเดตโพสต์
  updatePost(id: number, updatedPost: PostDTO): Observable<PostResponseDTO> {
    return this.http.put<PostResponseDTO>(`${this.apiUrl}/posts/${id}`, updatedPost, { withCredentials: true });
  }

  // ลบโพสต์
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`, { withCredentials: true });
  }

  // ดึงโพสต์ของผู้ใช้และเพื่อน
  getUserAndFriendsPosts(userId: number): Observable<PostResponseDTO[]> {
    return this.http.get<PostResponseDTO[]>(`${this.apiUrl}/posts/user-and-friends/${userId}`, { withCredentials: true });
  }

  // ดึงโพสต์ทั้งหมดของผู้ใช้
  getPostsByUser(userId: number): Observable<PostResponseDTO[]> {
    return this.http.get<PostResponseDTO[]>(`${this.apiUrl}/posts/user/${userId}`, { withCredentials: true });
  }
}
