import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShareResponse, PostResponseDTO } from '../../../type';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private baseUrl = 'http://localhost:8080/api/shares';  // URL สำหรับ ShareController

  constructor(private http: HttpClient) { }

  // แชร์โพสต์
  sharePost(userId: number, postId: number): Observable<ShareResponse> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('postId', postId.toString());

    return this.http.post<ShareResponse>(this.baseUrl, null, { params, withCredentials: true });
  }

  // ฟังก์ชันดึงโพสต์ที่ผู้ใช้แชร์
  getSharedPostsByUser(userId: number): Observable<PostResponseDTO[]> {
    return this.http.get<PostResponseDTO[]>(`${this.baseUrl}/user/${userId}`, { withCredentials: true });
  }

  // ลบการแชร์โพสต์ตาม ID
  deleteShare(shareId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${shareId}`, { withCredentials: true });
  }
}
