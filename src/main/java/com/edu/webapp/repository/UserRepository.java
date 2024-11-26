package com.edu.webapp.repository;

import com.edu.webapp.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    List<User> findAllByEmailIn(Set<String> usernames);

    List<User> findAllByIdIn(Set<String> usernames);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhoneAndEmailIsNot(String phone, String email);

    Page<User> findByEmailContaining(String email, Pageable pageable);


    @Query(nativeQuery = true, value = "WITH RECURSIVE DateRange AS ( \n" +
            "    SELECT CAST(? AS DATE) AS date_val -- ngày bắt đầu\n" +
            "    UNION ALL \n" +
            "    SELECT DATE_ADD(date_val, INTERVAL 1 DAY) -- Cộng 1 ngày vào date_val\n" +
            "    FROM DateRange \n" +
            "    WHERE date_val < ?  -- ngày kết thúc\n" +
            ")\n" +
            "SELECT COALESCE(COUNT(u.id), 0) AS user_count\n" +
            "FROM DateRange dr\n" +
            "LEFT JOIN user u ON DATE(u.created_at) = DATE(dr.date_val)\n" +
            "GROUP BY dr.date_val\n" +
            "ORDER BY dr.date_val\n")
    List<Integer> registrationCount(@Param("startDate") Date startDate,
                                        @Param("endDate") Date endDate);


    @Query(nativeQuery = true, value = "WITH RECURSIVE DateRange AS ( \n" +
            "    SELECT CAST(:startDate AS DATE) AS date_val -- ngày bắt đầu\n" +
            "    UNION ALL \n" +
            "    SELECT DATE_ADD(date_val, INTERVAL 1 DAY) \n" +  // Sử dụng DATE_ADD để cộng 1 ngày
            "    FROM DateRange \n" +
            "    WHERE date_val < :endDate  -- ngày kết thúc\n" +
            ")\n" +
            "SELECT COALESCE(COUNT(u.id), 0) AS user_count\n" +
            "FROM DateRange dr\n" +
            "LEFT JOIN user u ON DATE(u.uptime) = DATE(dr.date_val)\n" +
            "GROUP BY dr.date_val\n" +
            "ORDER BY dr.date_val")
    List<Integer> loginCount(@Param("startDate") Date startDate,
                             @Param("endDate") Date endDate);


    @Query(nativeQuery = true, value = "WITH RECURSIVE DateRange AS ( \n" +
            "    SELECT CAST(:startDate AS DATE) AS date_val -- ngày bắt đầu\n" +
            "    UNION ALL \n" +
            "    SELECT DATE_ADD(date_val, INTERVAL 1 DAY) \n" +  // Dùng DATE_ADD để cộng 1 ngày
            "    FROM DateRange \n" +
            "    WHERE date_val < CAST(:endDate AS DATE)  -- ngày kết thúc\n" +
            ")\n" +
            "SELECT COALESCE(COUNT(u.id), 0) AS user_count\n" +
            "FROM DateRange dr\n" +
            "LEFT JOIN user u ON DATE(u.recharge_vip) = DATE(dr.date_val) \n" +  // So sánh ngày
            "GROUP BY dr.date_val\n" +
            "ORDER BY dr.date_val")
    List<Integer> expiredUserCount(@Param("startDate") Date startDate,
                                   @Param("endDate") Date endDate);

}
