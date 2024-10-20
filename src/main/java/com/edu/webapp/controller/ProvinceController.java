package com.edu.webapp.controller;

import com.edu.webapp.model.response.ProvinceRes;
import com.edu.webapp.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/api/v1/province")
@RestController
public class ProvinceController {
    private final LocationService  locationService;
    @GetMapping
    public ResponseEntity<List<ProvinceRes>> province() {
        return ResponseEntity.ok(locationService.findAllProvince());
    }
}
