package com.edu.webapp.model.request;

import com.edu.webapp.model.enums.ActiveStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdvertisingPackageUpdateReq {
    private Integer id;
    private String advertisingName;
    private Double price;
    private String des;
    private ActiveStatus active;
}
