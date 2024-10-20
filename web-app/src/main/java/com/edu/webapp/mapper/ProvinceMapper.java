package com.edu.webapp.mapper;

import com.edu.webapp.entity.location.District;
import com.edu.webapp.entity.location.Province;
import com.edu.webapp.model.response.DistrictRes;
import com.edu.webapp.model.response.ProvinceRes;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ProvinceMapper {
    @Mapping(source = "district", target = "district", qualifiedByName = "mapDistrict")
    ProvinceRes provinceToProvinceRes(Province province);

    List<ProvinceRes> provinceListToProvinceList(List<Province> provinceList);


    @Named("mapDistrict")
    default List<DistrictRes> mapDistrict(List<District> districts) {
        if (districts == null || districts.isEmpty()) {
            return new ArrayList<>();
        }

        List<DistrictRes> res = new ArrayList<>();
        for (District district : districts) {
            res.add(DistrictRes.builder()
                    .id(district.getId())
                    .districtName(district.getName())
                    .build());
        }
        return res;
    }
}
