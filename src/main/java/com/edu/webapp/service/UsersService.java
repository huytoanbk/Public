package com.edu.webapp.service;

import com.edu.webapp.model.enums.NotiStatus;
import com.edu.webapp.model.request.*;
import com.edu.webapp.model.response.AuthRes;
import com.edu.webapp.model.response.UserRes;
import jakarta.mail.MessagingException;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UsersService {
    AuthRes register(UserCreateReq userCreateReq);

    String  uploadAvatar(MultipartFile avatar);

    UserRes getInfoUser();

    void changePassword(PasswordChangeReq request);

    UserRes updateInfo(UserChangeReq req);

    void sendOtpEmail(String email);

    void verifyOTP(VerifyOtpReq verifyOtpReq);

    void sendOtpPhone(String phone);

    Page<UserRes> getAllUser(Integer page, Integer size, String key);

    void changeNoti(NotiStatus notiStatus);

    UserRes getUser(String id);

    UserRes setRoles(UserRoleReq userRoleReq);
}
