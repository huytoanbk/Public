package com.edu.webapp.mapper;

import com.edu.webapp.entity.advertisement.PayAd;
import com.edu.webapp.model.response.PayAdRes;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PayAdMapper {
    PayAdRes payAdToPayAdRes(PayAd payAd);
}
