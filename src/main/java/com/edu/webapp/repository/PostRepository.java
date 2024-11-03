package com.edu.webapp.repository;

import com.edu.webapp.entity.post.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, String> {
    Page<Post> findByCreatedByAndContentContaining(String createdBy, String key, Pageable pageable);
}
