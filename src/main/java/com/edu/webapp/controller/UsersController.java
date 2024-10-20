package com.edu.webapp.controller;

import com.edu.webapp.model.request.PasswordChangeReq;
import com.edu.webapp.model.request.UserChangeReq;
import com.edu.webapp.model.request.UserCreateReq;
import com.edu.webapp.model.response.AuthRes;
import com.edu.webapp.model.response.UserRes;
import com.edu.webapp.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1/users")
@RestController
public class UsersController {
    private final UsersService usersService;

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
    public ResponseEntity<UserRes> updateInfo(@RequestBody UserChangeReq req){
        return ResponseEntity.ok(usersService.updateInfo(req));
    }

    @GetMapping
    public ResponseEntity<UserRes> getInfoUser() {
        return ResponseEntity.ok(usersService.getInfoUser());
    }
}
