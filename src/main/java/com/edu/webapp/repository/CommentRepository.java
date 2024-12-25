package com.edu.webapp.repository;

import com.edu.webapp.entity.post.Comment;
import com.edu.webapp.model.dto.PostCommentDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByPostIdAndCreatedAtBefore(String postId, OffsetDateTime createdAt, Pageable pageable);

    Page<Comment> findByPostId(String postId, Pageable pageable);


    @Query(nativeQuery = true, value = "SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n.num MONTH), '%Y-%m') AS Month\n" +
            "FROM (SELECT 0 AS num\n" +
            "      UNION ALL\n" +
            "      SELECT 1\n" +
            "      UNION ALL\n" +
            "      SELECT 2\n" +
            "      UNION ALL\n" +
            "      SELECT 3\n" +
            "      UNION ALL\n" +
            "      SELECT 4\n" +
            "      UNION ALL\n" +
            "      SELECT 5\n" +
            "      UNION ALL\n" +
            "      SELECT 6\n" +
            "      UNION ALL\n" +
            "      SELECT 7\n" +
            "      UNION ALL\n" +
            "      SELECT 8\n" +
            "      UNION ALL\n" +
            "      SELECT 9\n" +
            "      UNION ALL\n" +
            "      SELECT 10\n" +
            "      UNION ALL\n" +
            "      SELECT 11\n" +
            "      UNION ALL\n" +
            "      SELECT 12) n\n" +
            "ORDER BY Month ")
    List<String> get12Month();

    @Query(nativeQuery = true, value = "WITH LIST_MONTH AS (\n" +
            "    SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n.num MONTH), '%Y-%m') AS Month\n" +
            "    FROM (\n" +
            "        SELECT 0 AS num UNION ALL\n" +
            "        SELECT 1 UNION ALL\n" +
            "        SELECT 2 UNION ALL\n" +
            "        SELECT 3 UNION ALL\n" +
            "        SELECT 4 UNION ALL\n" +
            "        SELECT 5 UNION ALL\n" +
            "        SELECT 6 UNION ALL\n" +
            "        SELECT 7 UNION ALL\n" +
            "        SELECT 8 UNION ALL\n" +
            "        SELECT 9 UNION ALL\n" +
            "        SELECT 10 UNION ALL\n" +
            "        SELECT 11 UNION ALL\n" +
            "        SELECT 12\n" +
            "    ) n\n" +
            "    ORDER BY Month\n" +
            ")\n" +
            "SELECT  count(c.id)\n" +
            "FROM LIST_MONTH m\n" +
            "LEFT JOIN comment c ON m.Month = DATE_FORMAT(c.created_at, '%Y-%m')\n" +
            "group by Month\n" +
            "order by Month; ")
    List<Integer> countLikeByMonth();


    @Query(value = "SELECT new com.edu.webapp.model.dto.PostCommentDto(c.postId, COUNT(c.id)) " +
            "FROM Comment c " +
            "GROUP BY c.postId " +
            "ORDER BY COUNT(c.id) DESC")
    List<PostCommentDto> findTop10Comments();
}
