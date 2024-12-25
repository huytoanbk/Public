package com.edu.webapp.service.impl;

import com.edu.webapp.mapper.ProvinceMapper;
import com.edu.webapp.model.response.ProvinceRes;
import com.edu.webapp.repository.ProvinceRepository;
import com.edu.webapp.service.LocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {
    private final ProvinceRepository provinceRepository;
    private final ProvinceMapper provinceMapper;

    @Override
    @Cacheable("ProvinceRes")
    public List<ProvinceRes> findAllProvince() {
        return provinceMapper.provinceListToProvinceList(provinceRepository.findAll());
    }
}
