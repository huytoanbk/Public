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
@Table(name = "LIKE_POST", indexes = {@Index(name = "idx_user_id", columnList = "USER_ID")})
public class LikePost {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID", updatable = false, nullable = false)
    private String id;
    @Column(name = "POST_ID")
    private String postId;
    @Column(name = "USER_ID")
    private String userId;
    @Column(name = "CREATED_AT")
    @CreationTimestamp
    private OffsetDateTime createdAt;
}
