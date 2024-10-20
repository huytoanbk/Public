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
    private String statusRoom;
    private String roomType;
    private FilterRangeReq price;
    private FilterRangeReq acreage;
    private String location;
    private Integer page = 0;
    private Integer size = 10;
}
