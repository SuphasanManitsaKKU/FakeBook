
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostDTO, PostResponseDTO, Post } from '../../../type';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseUrl = 'http://localhost:8080/api/posts';  // Base URL สำหรับ PostController

  constructor(private http: HttpClient) { }

  // ดึงโพสต์ตาม ID
  getPostById(id: number): Observable<PostResponseDTO> {
    return this.http.get<PostResponseDTO>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  // สร้างโพสต์ใหม่
  createPost(postDTO: PostDTO): Observable<Post> {
    return this.http.post<Post>(this.baseUrl, postDTO, { withCredentials: true });
  }

  // อัพเดตโพสต์
  updatePost(id: number, updatedPost: PostDTO): Observable<PostResponseDTO> {
    return this.http.put<PostResponseDTO>(`${this.baseUrl}/${id}`, updatedPost, { withCredentials: true });
  }

  // ลบโพสต์
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  // ดึงโพสต์ของผู้ใช้และเพื่อน
  getUserAndFriendsPosts(userId: number): Observable<PostResponseDTO[]> {
    return this.http.get<PostResponseDTO[]>(`${this.baseUrl}/user-and-friends/${userId}`, { withCredentials: true });
  }
}
