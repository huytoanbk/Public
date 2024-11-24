package com.edu.webapp.repository;

import com.edu.webapp.entity.post.PostEls;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface PostElsRepository extends ElasticsearchRepository<PostEls, Integer> {
}
