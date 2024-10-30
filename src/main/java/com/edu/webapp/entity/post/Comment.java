package com.edu.webapp.entity.post;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "COMMENT", indexes = {@Index(name = "idx_post_id", columnList = "POST_ID")})
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID", updatable = false, nullable = false)
    private String id;
    @Column(name = "POST_ID")
    private String postId;
    @Column(name = "COMMENT")
    private String comment;
    @Column(name = "USER_ID")
    private String userId;
    @Column(name = "USER_TO")
    private String userTo;
    @Column(name = "CREATED_AT")
    @CreationTimestamp
    private OffsetDateTime createdAt;
}
