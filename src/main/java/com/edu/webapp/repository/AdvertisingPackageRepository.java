package com.edu.webapp.repository;


import com.edu.webapp.entity.advertisement.AdvertisingPackage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AdvertisingPackageRepository extends JpaRepository<AdvertisingPackage, Integer> {

    @Query("select a from AdvertisingPackage  a where  :advertisingName is null or a.advertisingName like concat( :advertisingName,'%')")
    Page<AdvertisingPackage> findAllByAdvertisingNameContaining(@Param("advertisingName") String advertisingName, Pageable pageable);
}
