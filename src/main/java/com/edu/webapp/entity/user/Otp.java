package com.edu.webapp.entity.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "OTP")
public class Otp {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID", updatable = false, nullable = false)
    private String id;
    @Column(name = "VALUE")
    private String value;
    @Column(name = "OTP")
    private String otp;
    @CreationTimestamp
    @Column(name = "CREATED_AT")
    private OffsetDateTime createdAt;
    @Column(name = "OTP_EXPIRY_TIME")
    private OffsetDateTime otpExpiryTime;
    @PrePersist
    private void prePersist() {
        this.otpExpiryTime = OffsetDateTime.now().plusMinutes(10);
    }
}
