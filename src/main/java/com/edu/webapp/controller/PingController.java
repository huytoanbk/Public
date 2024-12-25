package com.edu.webapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ping")
public class PingController {
    @GetMapping
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Em da bi lua");
    }
}
