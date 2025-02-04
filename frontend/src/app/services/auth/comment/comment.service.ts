import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentRequestDTO, Comment } from '../../../type';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) { }

  getCommentsByPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/post/${postId}`, { withCredentials: true });
  }

  getNestedComments(parentCommentId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/nested/${parentCommentId}`, { withCredentials: true });
  }

  createComment(commentRequest: CommentRequestDTO): Observable<Comment> {
    return this.http.post<Comment>(this.baseUrl, commentRequest, { withCredentials: true });
  }

  updateComment(id: number, updatedComment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.baseUrl}/${id}`, updatedComment, { withCredentials: true });
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  deleteCommentsByPost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/post/${postId}`, { withCredentials: true });
  }
}
