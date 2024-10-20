package com.edu.webapp.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ErrorCodes {
    ROLE_EXIST("ROLE_EXIST", "Vai trò đã tồn tại!"),
    EMAIL_EXIST("EMAIL_EXIST", "Email đã tồn tại!"),
    POST_NOT_EXIST("POST_NOT_EXIST", "POST_NOT_EXIST"),
    PHONE_EXIST("PHONE_EXIST", "Số điện thoại đã tồn tại!"),
    IMAGE_VALID("IMAGE_VALID", "IMAGE_VALID"),
    USER_NOT_EXIST("USER_NOT_EXIST", "Người dùng không tồn tại!"),
    PASSWORD_OLD_VALID("PASSWORD_OLD_VALID", "PASSWORD_OLD_VALID!"),
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "An unexpected error occurred");
    private final String code;
    private final String message;
}