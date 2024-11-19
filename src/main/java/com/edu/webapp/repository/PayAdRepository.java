package com.edu.webapp.repository;

import com.edu.webapp.entity.advertisement.PayAd;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PayAdRepository extends JpaRepository<PayAd, Integer> {
}
