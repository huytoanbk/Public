package com.edu.webapp.model.page;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Getter
@Setter
public class CustomPage<T> extends PageImpl<T> {
    private boolean nextPage;

    public CustomPage(List<T> content, Pageable pageable, long total, boolean nextPage) {
        super(content, pageable, total);
        this.nextPage = nextPage;
    }

}
