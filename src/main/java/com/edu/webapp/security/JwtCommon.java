package com.edu.webapp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtCommon {

    @Value("${security.jwt.secret}")
    private String secret;

    @Value("${security.jwt.token-validity}")
    private long tokenValidity; // Sử dụng long để đảm bảo không bị tràn số

    @Value("${security.jwt.refresh-token}")
    private long refreshTokenValidity;

    private final HttpServletRequest request;

    private Key getSignInKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String extractUsername() {
        return extractClaim(Claims::getSubject);
    }

    private String getTokenFromRequest() {
        String authorizationHeader = request.getHeader("Authorization");
        return (authorizationHeader != null && authorizationHeader.startsWith("Bearer "))
                ? authorizationHeader.substring(7)
                : null;
    }

    public <T> T extractClaim(Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims();
        return claims != null ? claimsResolver.apply(claims) : null; // Tránh NPE
    }

    private Claims extractAllClaims() {
        try {
            String token = getTokenFromRequest();
            return token != null
                    ? Jwts.parser().setSigningKey(getSignInKey()).build().parseClaimsJws(token).getBody()
                    : null; // Tránh NPE
        } catch (SignatureException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
            return null;
        }
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return generateRefreshToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + tokenValidity * 1000))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenValidity * 1000))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(UserDetails userDetails) {
        return !isTokenExpired() && userDetails.getUsername().equals(extractUsername());
    }

    private boolean isTokenExpired() {
        Claims claims = extractAllClaims();
        return claims != null && claims.getExpiration().before(new Date());
    }
}
