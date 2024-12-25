package com.edu.webapp.mapper;

import com.edu.webapp.entity.user.Role;
import com.edu.webapp.model.response.RoleRes;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = false))
public interface RoleMapper {
    RoleRes roleToRoleRes(Role role);
    List<RoleRes> rolesToRoleResList(List<Role> roles);
}
