package com.edu.webapp.model.response;

import com.edu.webapp.model.enums.NotiStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRes {
    private String id;

    private String fullName;

    private String email;

    private String phone;

    private String avatar;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy'T'HH:mm:ssXXX")
    private OffsetDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy'T'HH:mm:ssXXX")
    private OffsetDateTime updatedAt;

    private String active;

    private String notiStatus;

    private String province;

    private String district;

    private String address;

    private String introduce;

    private OffsetDateTime uptime;

    private List<RoleRes> roles;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate rechargeVip;

    private Integer postVip;
}
