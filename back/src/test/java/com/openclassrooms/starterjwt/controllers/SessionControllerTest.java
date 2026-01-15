package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional // Annule les modifs en base après chaque test
@DisplayName("Session Controller Integration Tests")
public class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    private Teacher teacher;

    @BeforeEach
    void setUp() {
        // Pour créer une session, il faut obligatoirement un Teacher en base
        teacher = new Teacher();
        teacher.setFirstName("Margot");
        teacher.setLastName("Robbie");
        teacher = teacherRepository.save(teacher);
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/session/{id} - Should return session when found")
    void shouldReturnSessionWhenFound() throws Exception {
        // Arrange
        Session session = new Session();
        session.setName("Yoga for Beginners");
        session.setDate(new Date());
        session.setDescription("Description");
        session.setTeacher(teacher);
        session = sessionRepository.save(session);

        // Act & Assert
        mockMvc.perform(get("/api/session/{id}", session.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Yoga for Beginners")))
                .andExpect(jsonPath("$.teacher_id", is(teacher.getId().intValue())));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/session/{id} - Should return 404 if not found")
    void shouldReturnNotFoundWhenSessionDoesNotExist() throws Exception {
        mockMvc.perform(get("/api/session/{id}", 9999L))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/session/{id} - Should return 400 if ID is invalid")
    void shouldReturnBadRequestWhenIdIsInvalid() throws Exception {
        mockMvc.perform(get("/api/session/{id}", "invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/session - Should return all sessions")
    void shouldReturnAllSessions() throws Exception {
        // Arrange
        Session s1 = new Session();
        s1.setName("Session 1");
        s1.setDate(new Date());
        s1.setDescription("Desc 1");
        s1.setTeacher(teacher);
        sessionRepository.save(s1);

        Session s2 = new Session();
        s2.setName("Session 2");
        s2.setDate(new Date());
        s2.setDescription("Desc 2");
        s2.setTeacher(teacher);
        sessionRepository.save(s2);

        // Act & Assert
        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Session 1")));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("POST /api/session - Should create a session")
    void shouldCreateSession() throws Exception {
        // Arrange
        SessionDto dto = new SessionDto();
        dto.setName("New Session");
        dto.setDate(new Date());
        dto.setTeacher_id(teacher.getId());
        dto.setDescription("New Description");

        // Act & Assert
        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("New Session")))
                .andExpect(jsonPath("$.description", is("New Description")));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("PUT /api/session/{id} - Should update a session")
    void shouldUpdateSession() throws Exception {
        // Arrange : Créer une session existante
        Session session = new Session();
        session.setName("Old Name");
        session.setDate(new Date());
        session.setDescription("Old Desc");
        session.setTeacher(teacher);
        session = sessionRepository.save(session);

        // DTO avec les nouvelles valeurs
        SessionDto dto = new SessionDto();
        dto.setName("Updated Name");
        dto.setDate(new Date());
        dto.setTeacher_id(teacher.getId());
        dto.setDescription("Updated Desc");

        // Act & Assert
        mockMvc.perform(put("/api/session/{id}", session.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Name")));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("DELETE /api/session/{id} - Should delete session")
    void shouldDeleteSession() throws Exception {
        // Arrange
        Session session = new Session();
        session.setName("To Delete");
        session.setDate(new Date());
        session.setDescription("Desc");
        session.setTeacher(teacher);
        session = sessionRepository.save(session);

        // Act
        mockMvc.perform(delete("/api/session/{id}", session.getId()))
                .andExpect(status().isOk());

        // Assert : Vérifier que la session n'existe plus
        mockMvc.perform(get("/api/session/{id}", session.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("DELETE /api/session/{id} - Should return 404 if session to delete not found")
    void shouldReturnNotFoundWhenDeletingNonExistentSession() throws Exception {
        mockMvc.perform(delete("/api/session/{id}", 9999L))
                .andExpect(status().isNotFound());
    }

    // --- Tests de Participation ---

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("POST /api/session/{id}/participate/{userId} - Should add user to session")
    void shouldParticipateInSession() throws Exception {
        // Arrange : Créer Session + User
        Session session = new Session();
        session.setName("Participation Test");
        session.setDate(new Date());
        session.setDescription("Desc");
        session.setTeacher(teacher);
        session.setUsers(new ArrayList<>()); // Important d'initialiser la liste
        session = sessionRepository.save(session);

        User user = new User("test@test.com", "Doe", "John", "password", false);
        user = userRepository.save(user);

        // Act
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", session.getId(), user.getId()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("POST /api/session/{id}/participate/{userId} - Should return 400 for invalid ID format")
    void shouldReturnBadRequestForParticipateWithInvalidId() throws Exception {
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", "invalid", "invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("DELETE /api/session/{id}/participate/{userId} - Should remove user from session")
    void shouldRemoveUserFromSession() throws Exception {
        // Arrange : Créer User
        User user = new User("test2@test.com", "Smith", "Jane", "password", false);
        user = userRepository.save(user);

        // Créer Session et y ajouter l'utilisateur directement
        Session session = new Session();
        session.setName("Unsubscribe Test");
        session.setDate(new Date());
        session.setDescription("Desc");
        session.setTeacher(teacher);
        session.setUsers(new ArrayList<>());
        session.getUsers().add(user); // On l'ajoute manuellement
        session = sessionRepository.save(session);

        // Act : On appelle l'API pour le retirer
        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", session.getId(), user.getId()))
                .andExpect(status().isOk());
    }
}
