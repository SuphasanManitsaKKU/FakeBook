package com.kku.testapi.WebSocket;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${FRONTEND_URL:http://localhost:4200}") // โหลดค่า FRONTEND_URL จาก .env
    private String frontendUrl;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/notification", "/room"); // เปิด Message Broker สำหรับ notification และ room
        config.setApplicationDestinationPrefixes("/app"); // Prefix สำหรับการส่ง message
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        System.out.println("--------------------");
        System.out.println(frontendUrl);
        System.out.println("--------------------");
        registry.addEndpoint("/api/ws")
                .setAllowedOrigins(frontendUrl); // ใช้ค่า FRONTEND_URL จาก .env
    }
}