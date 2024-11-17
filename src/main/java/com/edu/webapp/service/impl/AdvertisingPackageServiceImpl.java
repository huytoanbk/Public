package com.edu.webapp.service.impl;

import com.edu.webapp.entity.advertisement.AdvertisingPackage;
import com.edu.webapp.error.ErrorCodes;
import com.edu.webapp.error.ValidateException;
import com.edu.webapp.mapper.AdvertisingPackageMapper;
import com.edu.webapp.model.request.AdvertisingPackageCreateReq;
import com.edu.webapp.model.request.AdvertisingPackageUpdateReq;
import com.edu.webapp.model.response.AdvertisingPackageRes;
import com.edu.webapp.repository.AdvertisingPackageRepository;
import com.edu.webapp.security.JwtCommon;
import com.edu.webapp.service.AdvertisingPackageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AdvertisingPackageServiceImpl implements AdvertisingPackageService {
    private final AdvertisingPackageRepository advertisingPackageRepository;
    private final AdvertisingPackageMapper advertisingPackageMapper;
    private final JwtCommon jwtCommon;

    @Override
    public AdvertisingPackageRes createAdvertisingPackage(AdvertisingPackageCreateReq advertisingPackageCreateReq) {
        AdvertisingPackage advertisingPackage = advertisingPackageMapper.advertisingPackageCreateReqToAdvertisingPackage(advertisingPackageCreateReq);
        String email = jwtCommon.extractUsername();
        advertisingPackage.setCreatedBy(email);
        advertisingPackageRepository.save(advertisingPackage);
        return advertisingPackageMapper.advertisingPackageToAdvertisingPackageRes(advertisingPackage);
    }

    @Override
    public AdvertisingPackageRes getAdvertisingPackage(Integer id) {
        AdvertisingPackage advertisingPackage = advertisingPackageRepository.findById(id)
                .orElseThrow(() -> new ValidateException(ErrorCodes.ADVERTISING_PACKAGE_VALID));
        return advertisingPackageMapper.advertisingPackageToAdvertisingPackageRes(advertisingPackage);
    }

    @Override
    public Page<AdvertisingPackageRes> getAllAdvertisingPackages(Integer page, Integer size, String key) {
        Page<AdvertisingPackage> advertisingPackagePage;
        Pageable pageable;
        if (page == null) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by("createdAt").ascending());
            advertisingPackagePage = advertisingPackageRepository.findAll(pageable);
        } else {
            pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
            advertisingPackagePage = advertisingPackageRepository.findAllByAdvertisingName(key, pageable);
        }
        List<AdvertisingPackageRes> advertisingPackageRes = advertisingPackageMapper.listAdvertisingPackageToListAdvertisingPackageRes(advertisingPackagePage.getContent());
        return new PageImpl<>(advertisingPackageRes, pageable, advertisingPackagePage.getTotalElements());
    }

    @Override
    public AdvertisingPackageRes updateAdvertisingPackage(AdvertisingPackageUpdateReq advertisingPackageUpdateReq) {
        AdvertisingPackage advertisingPackage = advertisingPackageRepository.findById(advertisingPackageUpdateReq.getId())
                .orElseThrow(() -> new ValidateException(ErrorCodes.ADVERTISING_PACKAGE_VALID));
        advertisingPackage.setAdvertisingName(advertisingPackageUpdateReq.getAdvertisingName());
        advertisingPackage.setPrice(advertisingPackageUpdateReq.getPrice());
        advertisingPackage.setDes(advertisingPackageUpdateReq.getDes());
        advertisingPackage.setActive(advertisingPackageUpdateReq.getActive());
        advertisingPackageRepository.save(advertisingPackage);
        return advertisingPackageMapper.advertisingPackageToAdvertisingPackageRes(advertisingPackage);
    }
}
