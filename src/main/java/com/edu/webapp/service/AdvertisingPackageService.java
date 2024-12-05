package com.edu.webapp.service;

import com.edu.webapp.model.enums.ActiveStatus;
import com.edu.webapp.model.page.PayAdAdPage;
import com.edu.webapp.model.request.AdvertisingPackageCreateReq;
import com.edu.webapp.model.request.AdvertisingPackageUpdateReq;
import com.edu.webapp.model.request.PayAdCreateReq;
import com.edu.webapp.model.response.AdvertisingPackageRes;
import com.edu.webapp.model.response.PayAdAdRes;
import com.edu.webapp.model.response.PayAdRes;
import org.springframework.data.domain.Page;

import java.util.List;

public interface AdvertisingPackageService {

    AdvertisingPackageRes createAdvertisingPackage(AdvertisingPackageCreateReq advertisingPackageCreateReq);

    AdvertisingPackageRes getAdvertisingPackage(Integer id);

    Page<AdvertisingPackageRes> getAllAdvertisingPackages(Integer page, Integer size, String key, ActiveStatus status, List<Integer> type);

    AdvertisingPackageRes updateAdvertisingPackage(AdvertisingPackageUpdateReq advertisingPackageUpdateReq);

    PayAdRes createPayAd(PayAdCreateReq payAdCreateReq);

    PayAdRes getPayAd(Integer id);

    PayAdAdPage getPayAdAll(Integer page, Integer size);
}
