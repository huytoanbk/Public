package com.edu.webapp.repository;

import com.edu.webapp.entity.post.ReportPost;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface ReportPostRepository extends JpaRepository<ReportPost, String> {


    @Transactional
    @Modifying
    @Query("DELETE FROM ReportPost rp WHERE DATE( rp.createdAt) = DATE(:date)")
    void deleteByCreatedAt(@Param("date") Date date);

    @Query(nativeQuery = true, value = "WITH RECURSIVE DateRange AS (\n" +
            "    SELECT :startDate AS date_val -- ngày bắt đầu\n" +
            "    UNION ALL\n" +
            "    SELECT date_val + INTERVAL 1 DAY\n" +
            "    FROM DateRange\n" +
            "    WHERE date_val < :endDate  -- ngày kết thúc\n" +
            ")\n" +
            "SELECT IFNULL(rp.post_active, 0) AS user_count\n" +  // Trả về 0 nếu không có dữ liệu
            "FROM DateRange dr\n" +
            "LEFT JOIN report_post rp ON DATE(rp.created_at) = DATE(dr.date_val)\n" +
            "ORDER BY dr.date_val")
    List<Integer> postActiveCount(@Param("startDate") java.util.Date startDate,
                                  @Param("endDate") java.util.Date endDate);

    @Query(nativeQuery = true, value = "WITH RECURSIVE DateRange AS (\n" +
            "    SELECT :startDate AS date_val -- ngày bắt đầu\n" +
            "    UNION ALL\n" +
            "    SELECT date_val + INTERVAL 1 DAY\n" +
            "    FROM DateRange\n" +
            "    WHERE date_val < :endDate  -- ngày kết thúc\n" +
            ")\n" +
            "SELECT IFNULL(rp.post_inactive, 0) AS user_count\n" +  // Trả về 0 nếu không có dữ liệu
            "FROM DateRange dr\n" +
            "LEFT JOIN report_post rp ON DATE(rp.created_at) = DATE(dr.date_val)\n" +
            "ORDER BY dr.date_val")
    List<Integer> postPendingCount(@Param("startDate") java.util.Date startDate,
                                  @Param("endDate") java.util.Date endDate);

    @Query(nativeQuery = true, value = "WITH RECURSIVE DateRange AS (\n" +
            "    SELECT :startDate AS date_val -- ngày bắt đầu\n" +
            "    UNION ALL\n" +
            "    SELECT date_val + INTERVAL 1 DAY\n" +
            "    FROM DateRange\n" +
            "    WHERE date_val < :endDate  -- ngày kết thúc\n" +
            ")\n" +
            "SELECT IFNULL(rp.post_pending, 0) AS user_count\n" +  // Trả về 0 nếu không có dữ liệu
            "FROM DateRange dr\n" +
            "LEFT JOIN report_post rp ON DATE(rp.created_at) = DATE(dr.date_val)\n" +
            "ORDER BY dr.date_val")
    List<Integer> postRejectCount(@Param("startDate") java.util.Date startDate,
                                  @Param("endDate") java.util.Date endDate);

    @Query(nativeQuery = true, value = "WITH RECURSIVE DateRange AS (\n" +
            "    SELECT :startDate AS date_val -- ngày bắt đầu\n" +
            "    UNION ALL\n" +
            "    SELECT date_val + INTERVAL 1 DAY\n" +
            "    FROM DateRange\n" +
            "    WHERE date_val < :endDate  -- ngày kết thúc\n" +
            ")\n" +
            "SELECT IFNULL(rp.post_reject, 0) AS user_count\n" +  // Trả về 0 nếu không có dữ liệu
            "FROM DateRange dr\n" +
            "LEFT JOIN report_post rp ON DATE(rp.created_at) = DATE(dr.date_val)\n" +
            "ORDER BY dr.date_val")
    List<Integer> postInactiveCount(@Param("startDate") java.util.Date startDate,
                                  @Param("endDate") java.util.Date endDate);

}
