package com.edu.webapp.repository;

import com.edu.webapp.entity.post.Post;
import com.edu.webapp.model.dto.PostCommentDto;
import com.edu.webapp.model.enums.ActiveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, String> {
    Page<Post> findByCreatedByAndContentContaining(String createdBy, String key, Pageable pageable);

    Page<Post> findByCreatedByAndContentContainingAndActive(String createdBy, String key, ActiveStatus status, Pageable pageable);

    Integer countByCreatedBy(String createdBy);

    List<Post> findByIdIn(List<String> ids);

    @Query(value = "select p from Post p left join User u on p.createdBy=u.email where u.rechargeVip is not null and u.rechargeVip>=CURDATE() order by RAND() limit 10")
    List<Post> findRandomRecommend();

    Integer countByActive(ActiveStatus status);


}
