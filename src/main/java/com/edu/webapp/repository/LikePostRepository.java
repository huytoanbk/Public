package com.edu.webapp.repository;


import com.edu.webapp.entity.post.LikePost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikePostRepository extends JpaRepository<LikePost, String> {
}
