package com.edu.webapp.controller;

import com.edu.webapp.model.request.AuthReq;
import com.edu.webapp.model.response.AuthRes;
import com.edu.webapp.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@RestController
public class AuthenticationController {
    private final AuthenticationService authenticationService;


    @PostMapping("/authenticate")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<AuthRes> authentication(@RequestBody AuthReq request) {
        return ResponseEntity.ok(authenticationService.authentication(request));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthRes> refreshToken() {
        return ResponseEntity.ok(authenticationService.refreshToken());
    }
}
