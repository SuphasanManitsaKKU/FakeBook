package com.kku.testapi.Util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;

public class JwtUtil {

    // Generate a secure key
private static final String SECRET_KEY = "WZRHGrsBESr8wYFZ9sx0tPURuZgG2lmzyvWpwXPKz8U=";
private static final SecretKey KEY = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY));


    private static final long EXPIRATION_TIME = 86400000; // 1 day

    // Generate JWT Token
    public static String generateToken(String userId, String username) {
        return Jwts.builder()
                .setSubject(username) // Use username as the subject
                .claim("userId", userId) // Add userId as a custom claim
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(KEY) // Use the secure key
                .compact();
    }

    // Extract username from JWT Token
    public static String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
