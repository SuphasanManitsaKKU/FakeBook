package com.kku.testapi.service;

import com.kku.testapi.entity.Comment;
import com.kku.testapi.entity.Friend;
import com.kku.testapi.entity.Post;
import com.kku.testapi.entity.Share;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.CommentRepository;
import com.kku.testapi.repository.FriendRepository;
import com.kku.testapi.repository.PostRepository;
import com.kku.testapi.repository.ShareRepository;
import com.kku.testapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendRepository friendRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ShareRepository shareRepository;

    // Get all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Get post by ID
    public Post getPostById(Integer id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + id));
    }

    // Create a new post
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    // Update an existing post
    public Post updatePost(Integer id, Post updatedPost) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + id));

        existingPost.setContent(updatedPost.getContent());
        existingPost.setCommentAmount(updatedPost.getCommentAmount());
        existingPost.setLikeAmount(updatedPost.getLikeAmount());
        existingPost.setShareAmount(updatedPost.getShareAmount());

        return postRepository.save(existingPost);
    }

    // Delete a post
    public void deletePost(Integer id) {
        if (!postRepository.existsById(id)) {
            throw new IllegalArgumentException("Post not found with ID: " + id);
        }

        // ลบ Comments ที่เกี่ยวข้องกับโพสต์
        List<Comment> comments = commentRepository.findByPostId(id);
        commentRepository.deleteAll(comments);

        // ลบ Shares ที่เกี่ยวข้องกับโพสต์
        List<Share> shares = shareRepository.findByPostId(id);
        shareRepository.deleteAll(shares);

        // ลบโพสต์
        postRepository.deleteById(id);
    }

    public List<Post> getFriendsPosts(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // ดึงข้อมูลเพื่อนของผู้ใช้งาน
        List<Friend> friends = friendRepository.findByUserOneOrUserTwo(user, user);

        // แปลง `Friend` เป็น `User`
        List<User> friendUsers = friends.stream()
                .map(friend -> friend.getUserOne().equals(user) ? friend.getUserTwo() : friend.getUserOne())
                .collect(Collectors.toList());

        // ดึงโพสต์ของเพื่อน
        return postRepository.findByUserIn(friendUsers);
    }
}
