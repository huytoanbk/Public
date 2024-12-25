package com.edu.webapp.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FilterPostReq {
    private String province;
    private String district;
    private FilterRangeReq price;
    private FilterRangeReq acreage;
    private String type;
    private String key;
    private String fieldSort;
    private String statusRoom;
    private Integer page = 0;
    private Integer size = 10;
}
