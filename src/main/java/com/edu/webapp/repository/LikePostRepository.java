package com.edu.webapp.repository;


import com.edu.webapp.entity.post.LikePost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikePostRepository extends JpaRepository<LikePost, String> {
    List<LikePost> findLikePostByUserId(String userId);

    Page<LikePost> findLikePostByUserId(String userId, Pageable pageable);

    LikePost findLikePostByPostIdAndUserId(String postId, String userId);
}
