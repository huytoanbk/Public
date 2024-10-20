package com.edu.webapp.controller;

import com.edu.webapp.model.request.AuthReq;
import com.edu.webapp.model.response.AuthRes;
import com.edu.webapp.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@RestController
public class AuthenticationController {
    private final AuthenticationService authenticationService;


    @PostMapping("/authenticate")
    public ResponseEntity<AuthRes> authentication(@RequestBody AuthReq request) {
        return ResponseEntity.ok(authenticationService.authentication(request));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthRes> refreshToken() {
        return ResponseEntity.ok(authenticationService.refreshToken());
    }
}
