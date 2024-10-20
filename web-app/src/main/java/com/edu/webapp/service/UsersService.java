package com.edu.webapp.service;

import com.edu.webapp.model.request.PasswordChangeReq;
import com.edu.webapp.model.request.UserChangeReq;
import com.edu.webapp.model.request.UserCreateReq;
import com.edu.webapp.model.response.AuthRes;
import com.edu.webapp.model.response.UserRes;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UsersService {
    AuthRes register(UserCreateReq userCreateReq);

    void uploadAvatar(MultipartFile avatar);

    UserRes getInfoUser();

    void changePassword(PasswordChangeReq request);

    UserRes updateInfo(UserChangeReq req);
}
