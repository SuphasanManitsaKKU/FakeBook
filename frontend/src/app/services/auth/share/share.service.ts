import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShareResponse, PostResponseDTO } from '../../../type';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private apiUrl = environment.apiUrl; // ใช้ API URL จาก environment.ts

  constructor(private http: HttpClient) { }

  // แชร์โพสต์
  sharePost(userId: number, postId: number): Observable<ShareResponse> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('postId', postId.toString());

    return this.http.post<ShareResponse>(`${this.apiUrl}/shares`, null, { params, withCredentials: true });
  }

  // ฟังก์ชันดึงโพสต์ที่ผู้ใช้แชร์
  getSharedPostsByUser(userId: number): Observable<PostResponseDTO[]> {
    return this.http.get<PostResponseDTO[]>(`${this.apiUrl}/shares/user/${userId}`, { withCredentials: true });
  }

  // ลบการแชร์โพสต์ตาม ID
  deleteShare(shareId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/shares/${shareId}`, { withCredentials: true });
  }
}
