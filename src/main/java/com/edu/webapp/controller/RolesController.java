package com.edu.webapp.controller;

import com.edu.webapp.model.response.RoleRes;
import com.edu.webapp.service.RolesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/api/v1/roles")
@RestController
public class RolesController {
    private final RolesService rolesService;

    @GetMapping("/all")
    public ResponseEntity<List<RoleRes>> getAllRoles() {
        return ResponseEntity.ok(rolesService.getRoles());
    }
}
