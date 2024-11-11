package com.edu.webapp.repository;

import com.edu.webapp.entity.post.Post;
import com.edu.webapp.model.enums.ActiveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, String> {
    Page<Post> findByCreatedByAndContentContaining(String createdBy, String key, Pageable pageable);
    Page<Post> findByCreatedByAndContentContainingAndActive(String createdBy, String key, ActiveStatus status, Pageable pageable);

    Integer countByCreatedBy(String createdBy);
}
