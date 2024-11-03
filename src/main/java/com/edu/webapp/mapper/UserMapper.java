package com.edu.webapp.mapper;

import com.edu.webapp.entity.user.User;
import com.edu.webapp.model.request.UserCreateReq;
import com.edu.webapp.model.response.UserRes;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User userCreateReqToUser(UserCreateReq userCreateReq);

    @Mapping(source = "avatar", target = "avatar", qualifiedByName = "mapUserToAvatar")
    UserRes userToUserRes(User user);

    @Named("mapUserToAvatar")
    default String mapUserToAvatar(byte[] fileContent) {
        try {
//            return Base64.getEncoder().encodeToString(fileContent);
            if (fileContent != null) return "https://www.anhngumshoa.com/uploads/images/userfiles/banner_web3.jpg";
        } catch (Exception e) {
        }
        return null;
    }

    List<UserRes> listUserToUserRes(List<User> users);
}
