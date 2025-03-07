package com.kku.testapi.middleware;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class Cors {

    @Value("${FRONTEND_URL:http://localhost:4200}") // โหลดค่าจาก .env
    private String frontendUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // ปิด CSRF (ไม่แนะนำใน Production)
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // เปิดใช้งาน CORS
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // อนุญาตทุก API โดยไม่มีการตรวจสอบสิทธิ์
                );

        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    private UrlBasedCorsConfigurationSource corsConfigurationSource() {
        System.out.println("FRONTEND_URL: " + frontendUrl); // แสดงค่า FRONTEND_URL ที่โหลดจาก .env
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); // อนุญาตส่ง Credentials เช่น Cookies
        config.setAllowedOrigins(List.of(frontendUrl)); // ใช้ค่าจาก .env
        config.addAllowedHeader("*"); // อนุญาตทุก Header
        config.addAllowedMethod("*"); // อนุญาตทุก Method
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}