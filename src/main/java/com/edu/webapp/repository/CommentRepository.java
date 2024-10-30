package com.edu.webapp.repository;

import com.edu.webapp.entity.post.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
