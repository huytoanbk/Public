package com.edu.webapp.repository;

import com.edu.webapp.entity.location.Province;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProvinceRepository extends JpaRepository<Province, Integer> {
    Province findByCode(String code);
}
