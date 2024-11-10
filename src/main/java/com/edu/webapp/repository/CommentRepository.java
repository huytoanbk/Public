package com.edu.webapp.repository;

import com.edu.webapp.entity.post.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.time.OffsetDateTime;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByPostIdAndCreatedAtBefore(String postId, OffsetDateTime createdAt, Pageable pageable);
    Page<Comment> findByPostId(String postId, Pageable pageable);
}
