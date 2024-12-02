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
@Table(name = "NOTI_POST", indexes = {@Index(name = "idx_user_post", columnList = "USER_ID,POST_ID")})
public class NotiPost {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID", updatable = false, nullable = false)
    private String id;

    @Column(name = "USER_ID", nullable = false)
    private String userId;

    @Column(name = "POST_ID", nullable = false)
    private String postId;

    @Column(name = "CREATED_AT", updatable = false, nullable = false)
    @CreationTimestamp
    private OffsetDateTime createdAt;
}

