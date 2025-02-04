หน้าบ้าน angular

!! หมายเหตุ userid ของ user = this.userPublicService.getUserId() และ user name = this.userPublicService.getUsername()

มีหน้าอยู่ 3 หน้า 

1 หน้า home ในหน้านี้จะเรียกใช้ component feed เพื่อ post หรือ show post ของเพื่อนๆ

2 หน้า profile ในหน้านี้จะมี feed ของ post ที่ ถูก share โดยตัว user เอง

3 หน้า post ในหน้านี้จะ show เฉพาะ post ที่ถูก share จากการ กด share like ของ component post

มี 3 component

1 feed จะแสดงช่องกรอกข้อความที่ต้องการ post เมื่อกดจะมี modal ให้กรอกข้อความที่ต้องการ post และเหมื่อกดปุ่ม post จะแสดง sweetalert โพสเรียบร้อย และจะ refetch feed

2 post มีส่วนประกอบดังนี้
2.1 รูป profile

2.2 เวลาที่ post

2.3 มีข้อความที่ post

2.4 มีปุ่มให้ like เป็น toggle กด 1 ครั้งเพื่อ like และกดอีกครั้งเพื่อ unlike

2.5 มีปุ่มให้กด comment เทื่อกดแล้วจะมี modal ของ post เด่งขี้นมาทุกยิ่างของ post จะยังมีปกติ แต่ที่เพิ่มมาคือจะมีช่องให้กรอก comment ได้ และมีปุ่ม submit comment , comment จะต้องแก้ไขได้ like ได้ และ comment ใน commemt ได้

2.6 มีปุ่มให้กด share เมื่อกด จะมี modal เด่งขึ้นมา มีช่องความความให้กรอกข้อความที่ต้องการ share,มีปุ่มอยู่ 2 ปุ่ม ปุ่มแรกคือปุ่ม copy like เมื่อกดแล้วจะ copy like ของ post นั้น ปุ่มที่ 2 คือ ปุ่ม share จะ share ไปที่หน้า profile โดยจะขึ้นที่ feed ของหน้า profile ของเรา

3 มี service ที่ใช้เรียก API ของหลังบ้าน

หลังบ้าน java spring boot

ทำ api ให้ รองรับความต้องการของหน้าบ้าน


package com.kku.testapi.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String email;

    private String imageProfile;

    private String password;

    private String username;

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImageProfile() {
        return imageProfile;
    }

    public void setImageProfile(String imageProfile) {
        this.imageProfile = imageProfile;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}


-----------------------------

package com.kku.testapi.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "friend")
public class Friend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_one_id")
    private User userOne;

    @ManyToOne
    @JoinColumn(name = "user_two_id")
    private User userTwo;

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUserOne() {
        return userOne;
    }

    public void setUserOne(User userOne) {
        this.userOne = userOne;
    }

    public User getUserTwo() {
        return userTwo;
    }

    public void setUserTwo(User userTwo) {
        this.userTwo = userTwo;
    }
}

-----------------------

package com.kku.testapi.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer commentAmount;
    private String content;
    private Integer likeAmount;
    private Integer shareAmount;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime timestamp = LocalDateTime.now();

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCommentAmount() {
        return commentAmount;
    }

    public void setCommentAmount(Integer commentAmount) {
        this.commentAmount = commentAmount;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getLikeAmount() {
        return likeAmount;
    }

    public void setLikeAmount(Integer likeAmount) {
        this.likeAmount = likeAmount;
    }

    public Integer getShareAmount() {
        return shareAmount;
    }

    public void setShareAmount(Integer shareAmount) {
        this.shareAmount = shareAmount;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}




-----------------

package com.kku.testapi.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "_like")
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}



----------------



package com.kku.testapi.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "comment")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String message;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment;

    // ✅ เพิ่ม Getter สำหรับ userId
    public Integer getUserId() {
        return this.user != null ? this.user.getId() : null;
    }

    // ✅ Getter และ Setter อื่นๆ
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}


---------------



package com.kku.testapi.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "share")
public class Share {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
-----------------------------
@RequestMapping("/api/comments")
@GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPost(@PathVariable Integer postId)

public static class CommentRequest {
        public Integer postId;
        public String message;
        public Integer userId;
    }

    @PostMapping
    public Comment createComment(@RequestBody CommentRequest commentRequest)



// ✅ อัปเดตความคิดเห็น
    @PutMapping("/{id}")
    public Comment updateComment(@PathVariable Integer id, @RequestBody Comment updatedComment) {
        return commentService.updateComment(id, updatedComment);
    }

    // ✅ ลบความคิดเห็น
    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Integer id) {
        commentService.deleteComment(id);
    }

    // ✅ ลบความคิดเห็นทั้งหมดของโพสต์
    @DeleteMapping("/post/{postId}")
    public void deleteCommentsByPost(@PathVariable Integer postId) {
        commentService.deleteCommentsByPost(postId);
    }


--------------
@RequestMapping("/api/likes")

// Get all likes for a specific post
    @GetMapping("/post/{postId}")
    public List<Like> getLikesByPost(@PathVariable Integer postId) {
        return likeService.getLikesByPost(postId);
    }

    // Toggle like (if already liked, remove it; otherwise, add it)
    @PostMapping("/toggle")
    public boolean toggleLike(@RequestParam Integer userId, @RequestParam Integer postId)

------------
@RequestMapping("/api/posts")

@GetMapping("/{id}")
    public Post getPostById(@PathVariable Integer id)

@PostMapping
    public ResponseEntity<Post> createPost(@RequestBody PostDTO postDTO)

@PutMapping("/{id}")
    public Post updatePost(@PathVariable Integer id, @RequestBody Post updatedPost) {
        return postService.updatePost(id, updatedPost);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Integer id) {
        postService.deletePost(id);
    }

    @GetMapping("/user-and-friends/{userId}")
    public List<Post> getUserAndFriendsPosts(@PathVariable Integer userId)

------------
@RequestMapping("/api/shares")

// ดึงโพสต์ที่ผู้ใช้แชร์
@GetMapping("/user/{userId}")
    public List<Share> getSharedPostsByUser(@PathVariable Integer userId)

// แชร์โพสต์
    @PostMapping
    public Share sharePost(@RequestParam Integer userId, @RequestParam Integer postId)

@DeleteMapping("/{shareId}")
    public void deleteShare(@PathVariable Integer shareId)





จงสร้างหน้าบ้านและหลังบ้าน
ให้ตรงตามข้อมูลที่ให้ไป โดยยึกตามความต้องการของหน้าบ้านเป็นสำคัญ ในส่วนของหลังบ้านอะไรสมควรปรับแก้ไขก็ทำซะ ในส่วนของ หลังบ้านให้ทำเป็น controller,service,reposiry โดยระบบทั้งหมดนี้ต้องการที่จะทำให้เหมือน facebook มากที่สุด ถ้าอันไหนปรับแล้วมันดีขึ้นก็ปรับซะ


ขอ code หน้าหลบ้านและหลังบ้านทั้งหมด และไมาเอา canvas