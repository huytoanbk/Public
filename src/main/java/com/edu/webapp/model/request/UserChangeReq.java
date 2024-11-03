package com.edu.webapp.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserChangeReq {
    private String fullName;

    private String phone;

    private String province;

    private String district;

    private String address;

    private String introduce;
}
