package com.kku.testapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kku.testapi.entity.User;
import com.kku.testapi.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        UserController userController = new UserController(userService);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    void testHome() throws Exception {
        mockMvc.perform(get("/api/"))
                .andExpect(status().isOk())
                .andExpect(content().string("Hello World"));
    }

    @Test
    void testLoginSuccess() throws Exception {
        // Arrange
        String username = "testuser";
        String password = "password123";
        String token = "sample.jwt.token";

        User mockUser = new User();
        mockUser.setUsername(username);
        mockUser.setPassword(password);

        when(userService.login(username, password)).thenReturn(token);

        // Act & Assert
        mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockUser)))
                .andExpect(status().isOk())
                .andExpect(header().string("Set-Cookie", "token=" + token + "; Path=/; HttpOnly"))
                .andExpect(jsonPath("$.message").value("Login successful"));

        verify(userService, times(1)).login(username, password);
    }

    @Test
    void testLoginFailure() throws Exception {
        // Arrange
        String username = "testuser";
        String password = "wrongpassword";

        User mockUser = new User();
        mockUser.setUsername(username);
        mockUser.setPassword(password);

        when(userService.login(username, password)).thenThrow(new RuntimeException("Invalid username or password"));

        // Act & Assert
        mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockUser)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").doesNotExist());

        verify(userService, times(1)).login(username, password);
    }

    @Test
    void testLogout() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/logout"))
                .andExpect(status().isOk())
                .andExpect(header().string("Set-Cookie", "token=; Path=/; HttpOnly; Max-Age=0"))
                .andExpect(jsonPath("$.message").value("Logout successful"));
    }

    @Test
    void testRegisterSuccess() throws Exception {
        // Arrange
        User mockUser = new User();
        mockUser.setUsername("newuser");
        mockUser.setPassword("password123");
        mockUser.setEmail("newuser@example.com");

        when(userService.register(mockUser)).thenReturn("Register success");

        // Act & Assert
        mockMvc.perform(post("/api/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockUser)))
                .andExpect(status().isOk())
                .andExpect(content().string("Register success"));

        verify(userService, times(1)).register(mockUser);
    }
}
