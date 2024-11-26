package com.edu.webapp.entity.post;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Date;
import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "REPORT_POST")
public class ReportPost {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID", updatable = false, nullable = false)
    private String id;
    @Column(name = "POST_ACTIVE")
    private Integer postActive;
    @Column(name = "POST_INACTIVE")
    private Integer postInactive;
    @Column(name = "POST_PENDING")
    private Integer postPending;
    @Column(name = "POST_REJECT")
    private Integer postReject;
    @Column(name = "CREATED_AT")
    @CreationTimestamp
    private Date createdAt;
}
