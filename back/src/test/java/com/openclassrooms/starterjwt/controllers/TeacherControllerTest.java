package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
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

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest // Charge tout le contexte Spring (y compris H2)
@AutoConfigureMockMvc // Configure MockMvc pour simuler les requêtes HTTP
@Transactional // Important : Annule les modifications en BDD après chaque test (rollback)
@DisplayName("Teacher Controller Integration Tests")
public class TeacherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TeacherRepository teacherRepository;

    @BeforeEach
    public void setUp() {
        // Nettoyage explicite si besoin, bien que @Transactional gère le rollback
        // teacherRepository.deleteAll();
    }

    @Test
    @WithMockUser(username = "yoga@studio.com") // Simule un utilisateur connecté (nécessaire pour la sécurité)
    @DisplayName("GET /api/teacher/{id} - Should return teacher when ID exists")
    void shouldReturnTeacherWhenIdExists() throws Exception {
        // 1. Préparer la donnée dans H2
        Teacher teacher = new Teacher();
        teacher.setFirstName("Margot");
        teacher.setLastName("Robbie");
        teacher = teacherRepository.save(teacher); // Sauvegarde réelle en base

        // 2. Appeler l'API
        mockMvc.perform(get("/api/teacher/{id}", teacher.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                // 3. Vérifier les résultats
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Margot"))
                .andExpect(jsonPath("$.lastName").value("Robbie"));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/teacher/{id} - Should return 404 when ID does not exist")
    void shouldReturnNotFoundWhenIdDoesNotExist() throws Exception {
        // On interroge un ID qui n'existe pas en base
        mockMvc.perform(get("/api/teacher/{id}", 99999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/teacher/{id} - Should return 400 when ID is invalid")
    void shouldReturnBadRequestWhenIdIsInvalid() throws Exception {
        mockMvc.perform(get("/api/teacher/{id}", "invalid-id")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/teacher - Should return list of teachers")
    void shouldReturnListOfTeachers() throws Exception {
        // 1. Préparer les données
        Teacher t1 = new Teacher();
        t1.setFirstName("John");
        t1.setLastName("Doe");
        teacherRepository.save(t1);

        Teacher t2 = new Teacher();
        t2.setFirstName("Jane");
        t2.setLastName("Smith");
        teacherRepository.save(t2);

        // 2. Appeler l'API
        mockMvc.perform(get("/api/teacher")
                        .contentType(MediaType.APPLICATION_JSON))
                // 3. Vérifier qu'on a bien au moins nos 2 professeurs
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2))) // Vérifie la taille du tableau JSON
                .andExpect(jsonPath("$[0].firstName").value("John"))
                .andExpect(jsonPath("$[1].firstName").value("Jane"));
    }

    @Test
    // Pas de @WithMockUser ici pour tester la sécurité si nécessaire
    @DisplayName("GET /api/teacher - Should return 401 if not authenticated")
    void shouldReturnUnauthorizedIfNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/teacher")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}