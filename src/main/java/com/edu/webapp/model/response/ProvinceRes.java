package com.edu.webapp.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data

@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProvinceRes {
    private Integer id;
    private String name;
    List<DistrictRes> district;
}
