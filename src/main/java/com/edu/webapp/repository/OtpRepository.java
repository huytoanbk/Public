package com.edu.webapp.repository;

import com.edu.webapp.entity.user.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findTop1ByValueOrderByCreatedAtDesc(String value);
}
