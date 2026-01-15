package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("Auth Controller Integration Tests")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("POST /api/auth/login - Should authenticate user and return JWT")
    void shouldAuthenticateUser() throws Exception {
        // Arrange : Créer un utilisateur avec un mot de passe connu
        User user = new User("test@test.com", "Doe", "John", passwordEncoder.encode("password123"), false);
        userRepository.save(user);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("password123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue())) // Vérifie que le token est présent
                .andExpect(jsonPath("$.username", is("test@test.com")))
                .andExpect(jsonPath("$.id", is(user.getId().intValue())))
                .andExpect(jsonPath("$.admin", is(false)));
    }

    @Test
    @DisplayName("POST /api/auth/login - Should authenticate Admin user")
    void shouldAuthenticateAdminUser() throws Exception {
        // Arrange : Créer un admin
        User admin = new User("admin@test.com", "Admin", "Super", passwordEncoder.encode("admin123"), true);
        userRepository.save(admin);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("admin@test.com");
        loginRequest.setPassword("admin123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.admin", is(true))); // Vérifie le flag admin
    }

    @Test
    @DisplayName("POST /api/auth/login - Should return 401 for bad credentials")
    void shouldRejectBadCredentials() throws Exception {
        // Arrange
        User user = new User("test@test.com", "Doe", "John", passwordEncoder.encode("password123"), false);
        userRepository.save(user);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("wrongPassword"); // Mauvais mot de passe

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized()); // 401
    }

    @Test
    @DisplayName("POST /api/auth/register - Should register new user")
    void shouldRegisterUser() throws Exception {
        // Arrange
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("newuser@test.com");
        signupRequest.setFirstName("New");
        signupRequest.setLastName("User");
        signupRequest.setPassword("password123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("User registered successfully!")));
    }

    @Test
    @DisplayName("POST /api/auth/register - Should return 400 if email already exists")
    void shouldNotRegisterIfEmailExists() throws Exception {
        // Arrange : Créer un utilisateur existant
        User existingUser = new User("existing@test.com", "Doe", "John", "password", false);
        userRepository.save(existingUser);

        // Tenter de créer un compte avec le même email
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("existing@test.com");
        signupRequest.setFirstName("Another");
        signupRequest.setLastName("Person");
        signupRequest.setPassword("password123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest()) // 400
                .andExpect(jsonPath("$.message", is("Error: Email is already taken!")));
    }
}
