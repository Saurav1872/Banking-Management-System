package com.bank.BankingSystem.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.nio.charset.StandardCharsets;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwt-secret}")
    private String jwtSecret;

    @Value("${app.jwt-expiration-milliseconds}")
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        // Get user details to extract additional information
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        // Get the actual user entity to extract ID
        com.bank.BankingSystem.entity.User user = null;
        try {
            // This is a bit of a hack - we'll need to inject UserRepository
            // For now, we'll extract ID from the username if possible
            // In a real implementation, you'd want to inject UserRepository here
        } catch (Exception e) {
            logger.warn("Could not extract user ID from authentication", e);
        }
        
        // Create claims with additional user information
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", username); // subject (email)
        claims.put("name", userDetails.getUsername()); // For now, use username as name
        claims.put("role", userDetails.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                .orElse("USER"));
        // We'll add user ID later when we can inject UserRepository

        return Jwts.builder()
                .claims(claims)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public String getUsernameFromJWT(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            String username = claims.getSubject();
            logger.info("JWT Provider - Username extracted: " + username);
            return username;
        } catch (Exception ex) {
            logger.error("JWT Provider - Error extracting username from token", ex);
            throw ex;
        }
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(authToken);
            logger.info("JWT Provider - Token validation successful");
            return true;
        } catch (Exception ex) {
            logger.error("JWT Provider - Token validation failed", ex);
        }
        return false;
    }
} 