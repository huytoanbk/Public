package com.edu.webapp.repository;

import com.edu.webapp.entity.advertisement.PayAd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface PayAdRepository extends JpaRepository<PayAd, Integer> {
    @Query(nativeQuery = true, value = "WITH RECURSIVE DateRange AS ( \n" +
            "    SELECT :startDate AS date_val -- ngày bắt đầu\n" +
            "    UNION ALL \n" +
            "    SELECT date_val + INTERVAL 1 DAY \n" +
            "    FROM DateRange \n" +
            "    WHERE date_val < :endDate  -- ngày kết thúc\n" +
            ")\n" +
            "SELECT COALESCE(COUNT(p.id), 0) AS user_count\n" +
            "FROM DateRange dr\n" +
            "LEFT JOIN pay_ad p ON DATE(p.created_at) = DATE(dr.date_val)\n" +
            "GROUP BY dr.date_val\n" +
            "ORDER BY dr.date_val")
    List<Integer> packagePurchaseCount(@Param("startDate") Date startDate,
                                       @Param("endDate") Date endDate);

}
