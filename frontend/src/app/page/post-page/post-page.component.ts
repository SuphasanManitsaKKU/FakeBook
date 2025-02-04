import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/auth/post/post.service';
import { PostResponseDTO } from '../../type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostComponent } from '../../Components/post/post.component';

@Component({
  selector: 'app-post-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PostComponent],
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit {
  postId!: number;
  post: PostResponseDTO | null = null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.postId) {
      console.error("Post ID ไม่ถูกต้อง");
      return;
    }

    this.loadPost();
  }

  loadPost(): void {
    this.postService.getPostById(this.postId).subscribe({
      next: (postResponse: PostResponseDTO) => {
        this.post = postResponse;
      },
      error: (error) => {
        console.error('โหลดโพสต์ล้มเหลว:', error);
      }
    });
  }
}
