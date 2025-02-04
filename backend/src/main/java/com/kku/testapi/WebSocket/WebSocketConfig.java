package com.kku.testapi.WebSocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements
        WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(@SuppressWarnings("null") MessageBrokerRegistry config) {

        // config.enableSimpleBroker("/notification","/room");
        config.enableSimpleBroker("/notification","/room");
        // config.enableSimpleBroker("/room");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(@SuppressWarnings("null") StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:4200");
    }
}