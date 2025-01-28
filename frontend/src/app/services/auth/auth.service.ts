import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../type';
import { Comment } from '../../type';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080'; // URL ของ API

    constructor(private http: HttpClient) { }

    // ฟังก์ชันสำหรับการ Login
    login(username: string, password: string): Observable<any> {
        const body = { username, password };
        return this.http.post(`${this.apiUrl}/api/login`, body, { withCredentials: true });
    }

    // ฟังก์ชันสำหรับการ Register
    register(username: string, email: string, password: string): Observable<any> {
        const body = { username, email, password };
        return this.http.post(`${this.apiUrl}/api/register`, body);
    }

    getAllFriends(userId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/api/getAllFriends?id=${userId}`, { withCredentials: true });
    }

    // ----------------- Chat -----------------

    getOrCreateChatRoom(userOneId: number, userTwoId: number): Observable<any> {
        console.log(userOneId, userTwoId);

        return this.http.get(`${this.apiUrl}/api/chat/room?userOneId=${userOneId}&userTwoId=${userTwoId}`, { withCredentials: true });
    }

    getMessages(chatRoomId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/api/chat/messages?chatRoomId=${chatRoomId}`, { withCredentials: true });
    }

    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(this.apiUrl);
    }

    createPost(post: Post): Observable<Post> {
        return this.http.post<Post>(this.apiUrl, post);
    }

    getComments(postId: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.apiUrl}/post/${postId}`);
    }

    createComment(id: number, comment: Comment): Observable<Comment> {
        return this.http.post<Comment>(this.apiUrl, comment);
    }
}
