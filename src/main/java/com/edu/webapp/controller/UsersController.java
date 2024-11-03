package com.edu.webapp.controller;

import com.edu.webapp.model.enums.NotiStatus;
import com.edu.webapp.model.request.*;
import com.edu.webapp.model.response.AuthRes;
import com.edu.webapp.model.response.UserRes;
import com.edu.webapp.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@RestController
public class UsersController {
    private final UsersService usersService;


    @GetMapping("/email-send-otp")
    public ResponseEntity<?> sendOtpEmail(@RequestParam("email") String email) {
        usersService.sendOtpEmail(email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/phone-send-otp")
    public ResponseEntity<?> sendOtpPhone(@RequestParam("phone") String phone) {
        usersService.sendOtpPhone(phone);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyEmail(@RequestBody VerifyOtpReq verifyOtpReq) {
        usersService.verifyOTP(verifyOtpReq);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<AuthRes> register(@RequestBody UserCreateReq request) {
        return ResponseEntity.ok(usersService.register(request));
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile avatar) {
        usersService.uploadAvatar(avatar);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeReq request) {
        usersService.changePassword(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping()
    public ResponseEntity<UserRes> updateInfo(@RequestBody UserChangeReq req) {
        return ResponseEntity.ok(usersService.updateInfo(req));
    }

    @GetMapping
    public ResponseEntity<UserRes> getInfoUser() {
        return ResponseEntity.ok(usersService.getInfoUser());
    }

    @GetMapping("/all")
    public ResponseEntity<Page<UserRes>> getAllUsers(@RequestParam(required = false, defaultValue = "") String key,
                                                     @RequestParam(required = false, defaultValue = "0") Integer page,
                                                     @RequestParam(required = false, defaultValue = "10") Integer size) {
        return ResponseEntity.ok(usersService.getAllUser(page, size, key));
    }

    @PostMapping("/change-noti")
    public ResponseEntity<?> changeNoti(@RequestParam NotiStatus notiStatus) {
        usersService.changeNoti(notiStatus);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserRes> getUser(@PathVariable String id) {
        return ResponseEntity.ok(usersService.getUser(id));
    }

    @PostMapping("/set-roles")
    public ResponseEntity<UserRes> setRoles(@RequestBody UserRoleReq userRoleReq) {
        return ResponseEntity.ok(usersService.setRoles(userRoleReq));
    }
}
