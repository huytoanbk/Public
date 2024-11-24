package com.edu.webapp.repository;

import com.edu.webapp.entity.post.LogSearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LogSearchRepository extends JpaRepository<LogSearch, String> {
    @Query(value = "select l.keySearch from LogSearch l WHERE l.userId=:userId order by l.createdAt desc limit 10")
    List<String> findByUserId(@Param("userId") String userId);
}
