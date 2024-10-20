package com.edu.webapp.service;

import com.edu.webapp.model.request.RoleCreateReq;
import com.edu.webapp.model.response.RoleRes;
import org.springframework.data.domain.Page;

public interface RolesService {
    RoleRes createRole(RoleCreateReq role);
    Page<RoleRes> getRoles();
}
