export interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    imageProfile: string | null;   // รูปโปรไฟล์
    coverImage: string | null;     // รูป Cover
    bio: string | null;            // คำแนะนำตัว
    gender: 'MALE' | 'FEMALE' | 'OTHER' | null;  // เพศ (ENUM)
    birthday: string | null;       // วันเกิด (YYYY-MM-DD)
    location: string | null;       // ที่อยู่
}


export interface Comment {
    id: number;
    message: string;
    post: Post;
    user: User;
    parentComment: Comment | null; // Null หมายถึงเป็นคอมเมนต์หลัก
}

export interface ChatRoom {
    id: number;
    userOne: User;
    userTwo: User;
    messages: Message[];
}

export interface Message {
    id: number;
    chatRoom: ChatRoom;
    sender: User;
    content: string;
    timestamp: string;
}

// ---------------------------------------------------

// export interface FriendDto {
//     id: number;
//     username: string;
//     email: string;
// }

export interface FriendRequest {
    id: number;
    sender: User;
    receiver: User;
    status: 'pending' | 'accepted' | 'declined';
}

// post-dto.interface.ts
export interface PostDTO {
    content: string;
    userId: number;
}

// post-response-dto.interface.ts
export interface PostResponseDTO {
    id: number;
    content: string;
    user: User;  // ✅ ใช้ `User` แทน `userId`
    timestamp: string;
    likeAmount: number;
    commentAmount: number;
    shareAmount: number;
}

// post.interface.ts
// export interface Post {
//     id: number;
//     content: string;
//     userId: number;
//     timestamp: string;
//     likeAmount: number;
//     commentAmount: number;
//     shareAmount: number;
// }

// post-response-dto.interface.ts
export interface PostResponseDTO {
    id: number;
    content: string;
    userId: number;
    timestamp: string;  // Can be a string if you handle ISO 8601 formatted timestamps
    likeAmount: number;
    commentAmount: number;
    shareAmount: number;
}

// comment-request-dto.interface.ts
export interface CommentRequestDTO {
    message: string;
    postId: number;
    userId: number;
    parentCommentId?: number | null;
}

// post-response-dto.interface.ts
export interface Post {
    id: number;
    content: string;
    user: User;  // ✅ ใช้ `User` แทน `userId`
    timestamp: string;
}

export interface PostResponseDTO {
    id: number;
    content: string;
    userId: number;  // ✅ ใช้ `userId` แทน `User`
    timestamp: string;
    likeAmount: number;
    commentAmount: number;
    shareAmount: number;
}

// share-response.interface.ts
export interface ShareResponse {
    post: PostResponseDTO;
    shareId: number;
}

export interface NotificationRequestDto {
    userId: string; // ใช้ string แทน String
    notificationId: number;
    message: string; // ใช้ string แทน String
    type: string;    // ใช้ string แทน String
    contentId: string; // ใช้ number แทน Number
    status: number;
}
