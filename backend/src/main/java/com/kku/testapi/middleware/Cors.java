package com.kku.testapi.middleware;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class Cors {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // ปิด CSRF (ไม่แนะนำใน Production)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // อนุญาตทุก API โดยไม่มีการตรวจสอบสิทธิ์
            );

        return http.build();
    }
}
