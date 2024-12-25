package com.edu.webapp.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdvertisingPackageCreateReq {
    private String advertisingName;
    private Double price;
    private String des;
    private Integer countDate;
    private Integer type;
}
