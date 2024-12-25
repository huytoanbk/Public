package com.edu.webapp.service.impl;

import com.edu.webapp.config.CacheLocalConfig;
import com.edu.webapp.config.ImageConfig;
import com.edu.webapp.entity.user.Otp;
import com.edu.webapp.entity.user.Role;
import com.edu.webapp.entity.user.User;
import com.edu.webapp.error.ErrorCodes;
import com.edu.webapp.error.ValidateException;
import com.edu.webapp.mapper.ProvinceMapperImpl;
import com.edu.webapp.mapper.UserMapper;
import com.edu.webapp.model.enums.NotiStatus;
import com.edu.webapp.model.request.*;
import com.edu.webapp.model.response.AuthRes;
import com.edu.webapp.model.response.UserRes;
import com.edu.webapp.repository.OtpRepository;
import com.edu.webapp.repository.RoleRepository;
import com.edu.webapp.repository.UserRepository;
import com.edu.webapp.security.JwtCommon;
import com.edu.webapp.service.UsersService;
import com.edu.webapp.utils.OtpGenerator;
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
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UsersServiceImpl implements UsersService {
    private final UserRepository userRepository;
    private final JwtCommon jwtCommon;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final CacheLocalConfig cacheLocalConfig;
    private final JavaMailSender mailSender;
    private final OtpRepository otpRepository;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    private final ProvinceMapperImpl provinceMapperImpl;
    private final RoleRepository roleRepository;

    @Override
    public AuthRes register(UserCreateReq userCreateReq) {
        log.info("register request: {}", userCreateReq);
        if (userRepository.existsByEmail(userCreateReq.getEmail())) {
            throw new ValidateException(ErrorCodes.EMAIL_EXIST);
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
    public UserRes getInfoUser() {
        String email = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        return userMapper.userToUserRes(user);
    }

    @Override
    public void changePassword(PasswordChangeReq request) {
        String email = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new ValidateException(ErrorCodes.PASSWORD_OLD_VALID);
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public UserRes updateInfo(UserChangeReq req) {
        String email = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        if (userRepository.existsByPhoneAndEmailIsNot(req.getPhone(), email)) {
            throw new ValidateException(ErrorCodes.PHONE_EXIST);
        }
        user.setPhone(req.getPhone());
        user.setFullName(req.getFullName());
        user.setProvince(req.getProvince());
        user.setDistrict(req.getDistrict());
        user.setAddress(req.getAddress());
        user.setAvatar(req.getAvatar());
        user.setIntroduce(req.getIntroduce());
        userRepository.save(user);
        return userMapper.userToUserRes(user);
    }

    @Override
    @Async(value = "taskExecutorSendOtp")
    public void sendOtpEmail(String email) {
        try {
            String otp = OtpGenerator.generateOTP();
            System.out.println(otp);
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
            mailSender.send(mimeMessage);
            Otp otpEntity = new Otp();
            otpEntity.setOtp(otp);
            otpEntity.setValue(email);
            otpRepository.save(otpEntity);
        } catch (Exception exception) {
            log.error(exception.getMessage(), exception);
        }
    }

    @Override
    public void verifyOTP(VerifyOtpReq verifyOtpReq) {
        Otp otpEntity = otpRepository.findTop1ByValueOrderByCreatedAtDesc(verifyOtpReq.getValue()).orElseThrow(() -> new ValidateException(ErrorCodes.OTP_IS_INCORRECT));
        if (!otpEntity.getOtp().equals(verifyOtpReq.getOtp()) && OffsetDateTime.now().isAfter(otpEntity.getCreatedAt())) {
            throw new ValidateException(ErrorCodes.OTP_IS_INCORRECT);
        }
    }

    @Override
    @Async
    public void sendOtpPhone(String phone) {
//        String otp = OTPGenerator.generateOTP();
        Otp otpEntity = new Otp();
        otpEntity.setOtp("123456");
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

    @Override
    public UserRes getUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        return userMapper.userToUserRes(user);
    }

    @Override
    @Transactional
    public UserRes setRoles(UserRoleReq userRoleReq) {
        User user = userRepository.findById(userRoleReq.getId()).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        List<Role> roles = new ArrayList<>();
        for (String role : userRoleReq.getRoles()) {
            Role roleEntity = cacheLocalConfig.getRoleByName(role);
            if (roleEntity == null)
                throw new ValidateException(ErrorCodes.PERMISSION_NOT_EXIST);
            roles.add(roleEntity);
        }
        user.setRoles(roles);
        userRepository.save(user);
        return userMapper.userToUserRes(user);
    }

    @Override
    public void resetPassword(ResetPasswordReq resetPasswordReq) {
        User user = userRepository.findByEmail(resetPasswordReq.getEmail())
                .orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        String passwordNew = generatePassword(12);
        user.setPassword(passwordEncoder.encode(passwordNew));
        userRepository.save(user);
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(user.getEmail());
            helper.setSubject("Password Reset Request");
            String htmlContent = "<div style='font-family: Arial, sans-serif; color: #333;'>"
                    + "<h2 style='color: #4CAF50;'>Password Reset Request</h2>"
                    + "<p>Dear User,</p>"
                    + "<p>We have received a request to reset your password. If you did not make this request, please ignore this email.</p>"
                    + "<p>Your password reset code is:</p>"
                    + "<h1 style='color: #4CAF50;'>" + passwordNew + "</h1>"
                    + "<p>Please use this code to reset your password.</p>"
                    + "<br><p>If you have any questions, feel free to contact our support team.</p>"
                    + "<br><p>Best Regards,<br>TEST Support Team</p>"
                    + "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception exception) {
            log.error(exception.getMessage(), exception);
        }
    }

    @Override
    public UserRes updateStatus(UserUpdateStatusReq userUpdateStatusReq) {
        String email = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        user.setActive(userUpdateStatusReq.getActive());
        userRepository.save(user);
        return userMapper.userToUserRes(user);
    }

    public String generatePassword(int length) {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(CHARACTERS.length());
            password.append(CHARACTERS.charAt(index));
        }
        return password.toString();
    }
}
