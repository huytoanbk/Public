package com.edu.webapp.service.impl;

import com.edu.webapp.config.CacheLocalConfig;
import com.edu.webapp.config.ImageConfig;
import com.edu.webapp.entity.user.User;
import com.edu.webapp.error.ErrorCodes;
import com.edu.webapp.error.ValidateException;
import com.edu.webapp.mapper.UserMapper;
import com.edu.webapp.model.request.PasswordChangeReq;
import com.edu.webapp.model.request.UserChangeReq;
import com.edu.webapp.model.request.UserCreateReq;
import com.edu.webapp.model.response.AuthRes;
import com.edu.webapp.model.response.UserRes;
import com.edu.webapp.repository.UserRepository;
import com.edu.webapp.security.JwtCommon;
import com.edu.webapp.service.UsersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.Objects;

@Service
@Slf4j
@RequiredArgsConstructor
public class UsersServiceImpl implements UsersService {
    private final UserRepository userRepository;
    private final JwtCommon jwtCommon;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final ImageConfig imageConfig;
    private final CacheLocalConfig cacheLocalConfig;

    @Override
    public AuthRes register(UserCreateReq userCreateReq) {
        log.info("register request: {}", userCreateReq);
        if (userRepository.existsByEmail(userCreateReq.getEmail())) {
            throw new ValidateException(ErrorCodes.EMAIL_EXIST);
        }
        if (userRepository.existsByPhone(userCreateReq.getPhone())) {
            throw new ValidateException(ErrorCodes.PHONE_EXIST);
        }
        User user = userMapper.userCreateReqToUser(userCreateReq);
        user.setPassword(passwordEncoder.encode(userCreateReq.getPassword()));
        user.setRoles(Collections.singletonList(cacheLocalConfig.getRoleByName("USER")));
        userRepository.save(user);
        return AuthRes.builder()
                .token(jwtCommon.generateToken(user))
                .refreshToken(jwtCommon.generateRefreshToken(user))
                .build();
    }

    @Override
    public void uploadAvatar(MultipartFile avatar) {
        if (avatar.isEmpty()) throw new ValidateException(ErrorCodes.IMAGE_VALID);
        String contentType = avatar.getContentType();
        if (!imageConfig.isAllowedImageType(contentType)) {
            throw new ValidateException(ErrorCodes.IMAGE_VALID);
        }
        String email = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        try {
            user.setAvatar(avatar.getBytes());
            userRepository.save(user);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new ValidateException(ErrorCodes.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public UserRes getInfoUser() {
        String email = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        return userMapper.userToUserRes(user);
    }

    @Override
    public void changePassword(PasswordChangeReq request) {
        String email = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        String oldPasswordEd = passwordEncoder.encode(request.getOldPassword());
        if (!Objects.equals(oldPasswordEd, user.getPassword())) {
            throw new ValidateException(ErrorCodes.PASSWORD_OLD_VALID);
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public UserRes updateInfo(UserChangeReq req) {
        String email = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        user.setPhone(req.getPhone());
        user.setFullName(req.getFullName());
        userRepository.save(user);
        return userMapper.userToUserRes(user);
    }
}
