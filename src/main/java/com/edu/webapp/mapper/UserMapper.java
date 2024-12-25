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

    UserRes userToUserRes(User user);

    List<UserRes> listUserToUserRes(List<User> users);
}
