package com.edu.webapp.model.response;

import com.edu.webapp.model.enums.ActiveStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PayAdRes {
    private Integer id;
    private String advertisingPackage;
    private String userId;
    private double price;
    private ActiveStatus active;
    private OffsetDateTime createdAt;
    private Integer type;
}
