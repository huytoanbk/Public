package com.edu.webapp.repository;

import com.edu.webapp.entity.location.District;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DistrictRepository extends JpaRepository<District, Integer> {
}
