package com.edu.webapp.controller;

import com.edu.webapp.model.request.AdvertisingPackageCreateReq;
import com.edu.webapp.model.request.AdvertisingPackageUpdateReq;
import com.edu.webapp.model.response.AdvertisingPackageRes;
import com.edu.webapp.service.AdvertisingPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public @RequiredArgsConstructor
@RequestMapping("/api/v1/advertising-package")
@RestController class AdvertisingPackageController {
    private final AdvertisingPackageService advertisingPackageService;

    @PostMapping
    public ResponseEntity<AdvertisingPackageRes> createAdvertisingPackage(AdvertisingPackageCreateReq advertisingPackageCreateReq) {
        return ResponseEntity.ok(advertisingPackageService.createAdvertisingPackage(advertisingPackageCreateReq));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdvertisingPackageRes> getAdvertisingPackage(@PathVariable Integer id) {
        return ResponseEntity.ok(advertisingPackageService.getAdvertisingPackage(id));
    }

    @GetMapping
    public ResponseEntity<Page<AdvertisingPackageRes>> getAllAdvertisingPackages(@RequestParam(name = "page") Integer page,
                                                                                 @RequestParam(name = "size", defaultValue = "30") Integer size,
                                                                                 @RequestParam(name = "key", defaultValue = "") String key) {
        return ResponseEntity.ok(advertisingPackageService.getAllAdvertisingPackages(page, size, key));
    }

    @PutMapping()
    public ResponseEntity<AdvertisingPackageRes> updateAdvertisingPackage(AdvertisingPackageUpdateReq advertisingPackageUpdateReq) {
        return ResponseEntity.ok(advertisingPackageService.updateAdvertisingPackage(advertisingPackageUpdateReq));
    }
}
