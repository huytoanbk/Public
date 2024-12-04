package com.edu.webapp.model.page;

import com.edu.webapp.model.response.PayAdAdRes;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Getter
@Setter
public class PayAdAdPage extends PageImpl<PayAdAdRes> {
    private Double totalAmount;

    public PayAdAdPage(List<PayAdAdRes> content, Pageable pageable, long total, Double totalAmount) {
        super(content, pageable, total);
        this.totalAmount = totalAmount;
    }
}
