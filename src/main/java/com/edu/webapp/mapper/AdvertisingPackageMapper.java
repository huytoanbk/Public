package com.edu.webapp.mapper;

import com.edu.webapp.entity.advertisement.AdvertisingPackage;
import com.edu.webapp.model.request.AdvertisingPackageCreateReq;
import com.edu.webapp.model.response.AdvertisingPackageRes;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AdvertisingPackageMapper {
    AdvertisingPackage advertisingPackageCreateReqToAdvertisingPackage(AdvertisingPackageCreateReq advertisingPackageCreateReq);

    AdvertisingPackageRes advertisingPackageToAdvertisingPackageRes(AdvertisingPackage advertisingPackage);

    List<AdvertisingPackageRes> listAdvertisingPackageToListAdvertisingPackageRes(List<AdvertisingPackage> advertisingPackages);
}
