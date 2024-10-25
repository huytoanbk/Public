package com.edu.webapp.service.impl;

import com.edu.webapp.config.CacheLocalConfig;
import com.edu.webapp.config.ImageConfig;
import com.edu.webapp.entity.user.Otp;
import com.edu.webapp.entity.user.User;
import com.edu.webapp.error.ErrorCodes;
import com.edu.webapp.error.ValidateException;
import com.edu.webapp.mapper.UserMapper;
import com.edu.webapp.model.enums.NotiStatus;
import com.edu.webapp.model.request.PasswordChangeReq;
import com.edu.webapp.model.request.UserChangeReq;
import com.edu.webapp.model.request.UserCreateReq;
import com.edu.webapp.model.request.VerifyOtpReq;
import com.edu.webapp.model.response.AuthRes;
import com.edu.webapp.model.response.PostRes;
import com.edu.webapp.model.response.UserRes;
import com.edu.webapp.repository.OtpRepository;
import com.edu.webapp.repository.UserRepository;
import com.edu.webapp.security.JwtCommon;
import com.edu.webapp.service.UsersService;
import com.edu.webapp.utils.OTPGenerator;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
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
    private final JavaMailSender mailSender;
    private final OtpRepository otpRepository;


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

    @Override
    @Async(value = "taskExecutorSendOtp")
    public void sendOtpEmail(String email) {
        try {
            String otp = OTPGenerator.generateOTP();
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("Your OTP Code");
            String htmlContent = "<div style='font-family: Arial, sans-serif; color: #333;'>"
                    + "<h2 style='color: #4CAF50;'>Your OTP Code</h2>"
                    + "<p>Dear User,</p>"
                    + "<p>Your OTP code is:</p>"
                    + "<h1 style='color: #4CAF50;'>" + otp + "</h1>"
                    + "<p>Please enter this code to complete your verification process. This code is valid for 10 minutes.</p>"
                    + "<br><p>Best Regards,<br>TEST</p>"
                    + "</div>";
            helper.setText(htmlContent, true);
            Otp otpEntity = new Otp();
            otpEntity.setOtp(otp);
            otpEntity.setValue(email);
            otpRepository.save(otpEntity);
            mailSender.send(mimeMessage);
        } catch (Exception exception) {
            log.error(exception.getMessage(), exception);
        }
    }

    @Override
    public boolean verifyOTP(VerifyOtpReq verifyOtpReq) {
        Otp otpEntity = otpRepository.findTop1ByValueOrderByCreatedAtDesc(verifyOtpReq.getValue()).orElse(null);
        if (otpEntity == null) {
            return false;
        }
        return otpEntity.getOtp().equals(verifyOtpReq.getOtp()) && OffsetDateTime.now().isAfter(otpEntity.getCreatedAt());
    }

    @Override
    @Async
    public void sendOtpPhone(String phone) {
        String otp = OTPGenerator.generateOTP();
        Otp otpEntity = new Otp();
        otpEntity.setOtp(otp);
        otpEntity.setValue(phone);
        otpRepository.save(otpEntity);
    }

    @Override
    public Page<UserRes> getAllUser(Integer page, Integer size, String key) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findByEmailContaining(key, pageable);
        List<UserRes> userRes = userMapper.listUserToUserRes(users.getContent());
        return new PageImpl<>(userRes, pageable, users.getTotalElements());
    }

    @Override
    public void changeNoti(NotiStatus notiStatus) {
        String email = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        user.setNotiStatus(notiStatus);
        userRepository.save(user);
    }
}
