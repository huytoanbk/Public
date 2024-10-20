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
public class UserRes {
    private String id;

    private String fullName;

    private String email;

    private String phone;

    private String avatar;

    private String active;

    private List<RoleRes> roles;
}
