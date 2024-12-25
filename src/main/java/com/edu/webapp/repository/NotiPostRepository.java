package com.edu.webapp.repository;

import com.edu.webapp.entity.post.NotiPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotiPostRepository extends JpaRepository<NotiPost, String> {
    boolean existsByPostIdAndUserId(String postId, String userId);
}
