package com.edu.webapp.service.impl;

import com.edu.webapp.entity.user.User;
import com.edu.webapp.model.request.AuthReq;
import com.edu.webapp.model.response.AuthRes;
import com.edu.webapp.repository.UserRepository;
import com.edu.webapp.security.JwtCommon;
import com.edu.webapp.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;

    private final JwtCommon jwtCommon;


    @Override
    public AuthRes authentication(AuthReq authReq) {
        log.info("authentication request: {}", authReq);
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authReq.getEmail(),
                        authReq.getPassword())
        );
        User user = userRepository.findByEmail(authReq.getEmail()).orElseThrow(null);
        return AuthRes.builder()
                .token(jwtCommon.generateToken(user))
                .refreshToken(jwtCommon.generateRefreshToken(user))
                .build();
    }

    @Override
    public AuthRes refreshToken() {
        String username = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(username).orElseThrow(null);
        return AuthRes.builder()
                .token(jwtCommon.generateToken(user))
                .refreshToken(jwtCommon.generateRefreshToken(user))
                .build();
    }
}
