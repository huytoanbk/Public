package com.edu.webapp.service;

import com.edu.webapp.model.request.AdvertisingPackageCreateReq;
import com.edu.webapp.model.request.AdvertisingPackageUpdateReq;
import com.edu.webapp.model.response.AdvertisingPackageRes;
import org.springframework.data.domain.Page;

public interface AdvertisingPackageService {

    AdvertisingPackageRes createAdvertisingPackage(AdvertisingPackageCreateReq advertisingPackageCreateReq);

    AdvertisingPackageRes getAdvertisingPackage(Integer id);

    Page<AdvertisingPackageRes> getAllAdvertisingPackages(Integer page, Integer size, String key);

    AdvertisingPackageRes updateAdvertisingPackage(AdvertisingPackageUpdateReq advertisingPackageUpdateReq);
}
