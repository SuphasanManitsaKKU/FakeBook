import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentRequestDTO, Comment } from '../../../type';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = environment.apiUrl; // ใช้ API URL จาก environment.ts

  constructor(private http: HttpClient) { }

  getCommentsByPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/comments/post/${postId}`, { withCredentials: true });
  }

  getNestedComments(parentCommentId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/comments/nested/${parentCommentId}`, { withCredentials: true });
  }

  createComment(commentRequest: CommentRequestDTO): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/comments`, commentRequest, { withCredentials: true });
  }

  updateComment(id: number, updatedComment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/comments/${id}`, updatedComment, { withCredentials: true });
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${id}`, { withCredentials: true });
  }

  deleteCommentsByPost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/post/${postId}`, { withCredentials: true });
  }
}
