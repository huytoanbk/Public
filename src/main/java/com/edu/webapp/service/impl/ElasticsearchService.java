package com.edu.webapp.service.impl;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOptions;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.FunctionScoreQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ElasticsearchService<T> {
    private final ElasticsearchClient elasticsearchClient;

    public Page<T> search(String indexName, BoolQuery boolQuery, int page, int size, Class<T> clazz, Map<String, SortOrder> map) throws IOException {
        Query query = Query.of(q -> q.bool(boolQuery));
        SearchRequest request = SearchRequest.of(s -> s
                        .index(indexName)
                        .from(page * size)
                        .query(query)
                        .size(10)
                        .sort(sort -> {
                            map.forEach((k, v) -> sort.field(f-> f.field(k).order(v)));
                            return sort;
                        })
        );
        SearchResponse<T> response = elasticsearchClient.search(request, clazz);
        assert response.hits().total() != null;
        long totalHits = response.hits().total().value();
        List<T> content = response.hits().hits().stream()
                .map(Hit::source)
                .toList();
        return new PageImpl<>(content, PageRequest.of(page, size), totalHits);
    }
}
