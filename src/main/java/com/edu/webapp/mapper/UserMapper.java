package com.edu.webapp.mapper;

import com.edu.webapp.entity.user.User;
import com.edu.webapp.model.request.UserCreateReq;
import com.edu.webapp.model.response.UserRes;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Base64;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User userCreateReqToUser(UserCreateReq userCreateReq);


    @Mapping(source = "avatar", target = "avatar", qualifiedByName  = "mapUserToAvatar")
    UserRes userToUserRes(User user);

    @Named("mapUserToAvatar")
    default String mapUserToAvatar(byte[] fileContent) {
        return Base64.getEncoder().encodeToString(fileContent);
    }
}
