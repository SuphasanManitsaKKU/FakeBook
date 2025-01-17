package com.kku.testapi.service;

import com.kku.testapi.Util.JwtUtil;
import com.kku.testapi.entity.User;
import com.kku.testapi.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceActionTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceAction userServiceAction;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoginSuccess() {
        // Arrange
        String username = "testuser";
        String password = "password123";
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(password);
        User mockUser = new User();
        mockUser.setUsername(username);
        mockUser.setPassword(encodedPassword);

        when(userRepository.findByUsername(username)).thenReturn(mockUser);

        // Act
        String token = userServiceAction.login(username, password);

        // Assert
        assertNotNull(token);
        assertEquals(username, JwtUtil.getUsernameFromToken(token));
    }

    @Test
    void testLoginInvalidPassword() {
        // Arrange
        String username = "testuser";
        String password = "wrongpassword";
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode("password123");
        User mockUser = new User();
        mockUser.setUsername(username);
        mockUser.setPassword(encodedPassword);

        when(userRepository.findByUsername(username)).thenReturn(mockUser);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> userServiceAction.login(username, password));
    }

    @Test
    void testRegisterSuccess() {
        // Arrange
        String username = "newuser";
        String password = "password123";
        String email = "newuser@example.com";

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password);
        newUser.setEmail(email);

        when(userRepository.findByUsername(username)).thenReturn(null);
        when(userRepository.findByEmail(email)).thenReturn(null);

        // Act
        String result = userServiceAction.register(newUser);

        // Assert
        assertEquals("Register success", result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterDuplicateUsername() {
        // Arrange
        String username = "existinguser";
        String password = "password123";
        String email = "newemail@example.com";

        User existingUser = new User();
        existingUser.setUsername(username);
        existingUser.setPassword(password);
        existingUser.setEmail(email);

        when(userRepository.findByUsername(username)).thenReturn(existingUser);

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password);
        newUser.setEmail(email);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> userServiceAction.register(newUser));
    }

    @Test
    void testRegisterDuplicateEmail() {
        // Arrange
        String username = "newuser";
        String password = "password123";
        String email = "existingemail@example.com";

        User existingUser = new User();
        existingUser.setUsername("differentuser");
        existingUser.setPassword(password);
        existingUser.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(existingUser);

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password);
        newUser.setEmail(email);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> userServiceAction.register(newUser));
    }
}
