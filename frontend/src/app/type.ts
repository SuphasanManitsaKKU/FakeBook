export interface ChatRoom {
    id: number;
    userOne: User;
    userTwo: User;
}

export interface Friend {
    id: number;
    user: User;
}

export interface User {
    id: number;
    email: string;
    imageProfile: string | null;
    password: string;
    username: string;
}

export interface Sender {
    id: number;
    email: string;
    imageProfile: string | null;
    password: string;
    username: string;
}

export interface Message {
    id: number;
    chatRoom: ChatRoom;
    sender: Sender;
    content: string;
    timestamp: string; // ใช้เป็น string เนื่องจาก timestamp มาในรูปแบบ ISO-8601
}

export interface Post {
    id: number;
    content: string;
    likeAmount: number;
    commentAmount: number;
    shareAmount: number;
    userId: number;
    comments: Comment[];
}

export interface Comment {
    id: number;
    message: string;
    postId: number;
    userId: number;
    parentCommentId?: number;
}
