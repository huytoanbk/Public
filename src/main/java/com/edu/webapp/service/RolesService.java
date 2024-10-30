package com.edu.webapp.service;

import com.edu.webapp.model.request.RoleCreateReq;
import com.edu.webapp.model.response.RoleRes;
import org.springframework.data.domain.Page;

import java.util.List;

public interface RolesService {
    RoleRes createRole(RoleCreateReq role);
    List<RoleRes> getRoles();
}
