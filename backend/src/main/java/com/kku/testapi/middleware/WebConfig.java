package com.kku.testapi.middleware;



import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // ตั้งค่า CORS สำหรับเส้นทาง /api/**
                .allowedOrigins("http://localhost:4200") // อนุญาต Origin ของ Frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // อนุญาต HTTP Methods
                .allowedHeaders("*") // อนุญาต Headers ทั้งหมด
                .allowCredentials(true); // อนุญาตการส่ง Cookie หรือ Authorization Headers
    }
}
