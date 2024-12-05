package com.edu.webapp.repository;


import com.edu.webapp.entity.advertisement.AdvertisingPackage;
import com.edu.webapp.model.enums.ActiveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdvertisingPackageRepository extends JpaRepository<AdvertisingPackage, Integer> {

    @Query("select a from AdvertisingPackage  a where (:status is null or a.active=:status) and  (:advertisingName is null or a.advertisingName like concat( :advertisingName,'%')) and a.type in :type")
    Page<AdvertisingPackage> findAllByStatusAndAdvertisingNameContainingAndType(@Param("status") ActiveStatus status, @Param("advertisingName") String advertisingName,@Param("type") List<Integer> type, Pageable pageable);

    @Query("select a from AdvertisingPackage  a where (:status is null or a.active=:status) and a.type in :type")
    Page<AdvertisingPackage> findAllByStatusAndType(@Param("status") ActiveStatus status,@Param("type") List<Integer> type, Pageable pageable);
}
