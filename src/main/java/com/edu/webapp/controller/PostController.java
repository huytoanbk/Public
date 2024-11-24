package com.edu.webapp.controller;

import com.edu.webapp.model.enums.ActiveStatus;
import com.edu.webapp.model.request.*;
import com.edu.webapp.model.response.CommentRes;
import com.edu.webapp.model.response.PostRes;
import com.edu.webapp.model.response.PostUserRes;
import com.edu.webapp.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/api/v1/posts")
@RestController
public class PostController {
    private final PostService postService;

    @PostMapping()
    public ResponseEntity<String> createPost(@RequestBody PostCreateReq postCreateRequest) {
        postService.createPost(postCreateRequest);
        return ResponseEntity.ok("Post created successfully");
    }

    @PostMapping("/search")
    public ResponseEntity<Page<PostRes>> getPosts(@RequestBody(required = false) FilterPostReq filterPostReq) throws IOException {
        if (filterPostReq == null) filterPostReq = new FilterPostReq();
        return ResponseEntity.ok(postService.search(filterPostReq));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostRes> getPost(@PathVariable String id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PostMapping("/comment")
    public ResponseEntity<CommentRes> commentPost(@RequestBody CommentReq commentReq) {
        return ResponseEntity.ok(postService.createComment(commentReq));
    }

    @PostMapping("/list-comment")
    public ResponseEntity<Page<CommentRes>> getComments(@RequestBody CommentPostSearchReq commentPostSearchReq) {
        return ResponseEntity.ok(postService.getListCommentPost(commentPostSearchReq));
    }

    @GetMapping("/search-user-post")
    public ResponseEntity<Page<PostUserRes>> getPostByUser(@RequestParam(name = "page", defaultValue = "0") Integer page,
                                                           @RequestParam(name = "size", defaultValue = "30") Integer size,
                                                           @RequestParam(name = "key", defaultValue = "") String key,
                                                           @RequestParam(name = "status", required = false) ActiveStatus status) {
        return ResponseEntity.ok(postService.searchPostUser(page, size, key, status));
    }

    @PutMapping("/update")
    public ResponseEntity<PostRes> updatePost(@RequestBody PostUpdateReq postUpdateReq) {
        return ResponseEntity.ok(postService.updatePost(postUpdateReq));
    }

    @PostMapping("/like-post/{id}")
    public ResponseEntity<?> likePost(@PathVariable String id) {
        postService.likePost(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/like-post")
    public ResponseEntity<Page<PostRes>> listPostLike(@RequestParam(name = "page", defaultValue = "0") Integer page,
                                                      @RequestParam(name = "size", defaultValue = "30") Integer size) {
        return ResponseEntity.ok(postService.listPostLike(page, size));
    }

    @GetMapping("/recommend")
    public ResponseEntity<List<PostRes>> recommend() throws IOException {
        return ResponseEntity.ok(postService.recommend());
    }

    @PutMapping("update-status")
    public ResponseEntity<PostRes> updatePostStatus(@RequestBody PostUpdateStatusReq postUpdateStatusReq) {
        return ResponseEntity.ok(postService.updatePostStatus(postUpdateStatusReq));
    }
}