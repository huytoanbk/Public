package com.edu.webapp.repository;


import com.edu.webapp.entity.advertisement.AdvertisingPackage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdvertisingPackageRepository extends JpaRepository<AdvertisingPackage, Integer> {
    Page<AdvertisingPackage> findAllByAdvertisingName(String advertisingName, Pageable pageable);
}
