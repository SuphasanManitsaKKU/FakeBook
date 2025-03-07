package com.kku.testapi.middleware;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private JwtInterceptor jwtInterceptor;

    @Value("${FRONTEND_URL:http://localhost:4200}") // โหลดค่า FRONTEND_URL จาก .env
    private String frontendUrl;

    @Override
    public void addCorsMappings(@SuppressWarnings("null") CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(frontendUrl) // ใช้ค่า FRONTEND_URL จาก .env
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addInterceptors(@SuppressWarnings("null") InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/api/**") // ใช้ Interceptor กับทุก API ใน /api/**
                .excludePathPatterns(
                        "/api/users/login", 
                        "/api/users/register", 
                        "/api/users/logout", 
                        "/api"
                ); // ยกเว้น API ที่ไม่ต้องใช้ JWT
    }
}