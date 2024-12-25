package com.edu.webapp.service.impl;

import com.edu.webapp.entity.user.Role;
import com.edu.webapp.error.ErrorCodes;
import com.edu.webapp.error.ValidateException;
import com.edu.webapp.mapper.RoleMapper;
import com.edu.webapp.model.request.RoleCreateReq;
import com.edu.webapp.model.response.RoleRes;
import com.edu.webapp.repository.RoleRepository;
import com.edu.webapp.service.RolesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
@Slf4j
@RequiredArgsConstructor
public class RolesServiceImpl implements RolesService {
    private final RoleRepository roleRepository;

    private final RoleMapper roleMapper;

    @Override
    public RoleRes createRole(RoleCreateReq roleCreateReq) {
        log.info("createRole roleCreateReq={}", roleCreateReq);
        if (roleRepository.existsByName(roleCreateReq.getName()))
            throw new ValidateException(ErrorCodes.ROLE_EXIST);
        Role role = new Role();
        role.setName(roleCreateReq.getName().toUpperCase(Locale.ROOT));
        return roleMapper.roleToRoleRes(roleRepository.save(role));
    }

    @Override
    public List<RoleRes> getRoles() {
        List<Role> roles = roleRepository.findAll();
        return roleMapper.rolesToRoleResList(roles);
    }
}
