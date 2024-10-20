package com.edu.webapp.service;

import com.edu.webapp.model.response.ProvinceRes;

import java.util.List;

public interface LocationService {
    List<ProvinceRes> findAllProvince();
}
