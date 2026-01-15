package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private SessionService sessionService;

    private Session session;
    private User user;

    @BeforeEach
    void setup() {
        user = new User();
        user.setId(42L);
        user.setEmail("test@email.com");

        session = new Session();
        session.setId(1L);
        session.setUsers(new ArrayList<>());
    }

    @Test
    void create_shouldSaveSession() {
        when(sessionRepository.save(session)).thenReturn(session);
        Session result = sessionService.create(session);
        assertEquals(session, result);
        verify(sessionRepository).save(session);
    }

    @Test
    void delete_shouldDeleteById() {
        sessionService.delete(1L);
        verify(sessionRepository).deleteById(1L);
    }

    @Test
    void findAll_shouldReturnAllSessions() {
        List<Session> sessions = Arrays.asList(session);
        when(sessionRepository.findAll()).thenReturn(sessions);
        List<Session> result = sessionService.findAll();
        assertEquals(sessions, result);
        verify(sessionRepository).findAll();
    }

    @Test
    void getById_shouldReturnSessionIfExists() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        assertEquals(session, sessionService.getById(1L));
    }

    @Test
    void getById_shouldReturnNullIfNotExists() {
        when(sessionRepository.findById(2L)).thenReturn(Optional.empty());
        assertNull(sessionService.getById(2L));
    }

    @Test
    void update_shouldSetIdAndSave() {
        Session sessionToUpdate = new Session();
        sessionToUpdate.setUsers(new ArrayList<>());
        when(sessionRepository.save(any(Session.class))).thenReturn(sessionToUpdate);

        Session result = sessionService.update(5L, sessionToUpdate);

        assertEquals(5L, sessionToUpdate.getId());
        assertEquals(sessionToUpdate, result);
        verify(sessionRepository).save(sessionToUpdate);
    }

    @Test
    void participate_shouldAddUserIfNotAlreadyParticipant() {
        session.setUsers(new ArrayList<>()); // no participants
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(42L)).thenReturn(Optional.of(user));
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        sessionService.participate(1L, 42L);

        assertTrue(session.getUsers().contains(user));
        verify(sessionRepository).save(session);
    }

    @Test
    void participate_shouldThrowNotFoundIfSessionOrUserMissing() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());
        when(userRepository.findById(42L)).thenReturn(Optional.of(user));

        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 42L));

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(42L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 42L));
    }

    @Test
    void participate_shouldThrowBadRequestIfAlreadyParticipant() {
        session.getUsers().add(user);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(42L)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 42L));
    }

    @Test
    void noLongerParticipate_shouldRemoveUserIfParticipant() {
        session.getUsers().add(user);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        sessionService.noLongerParticipate(1L, 42L);

        assertFalse(session.getUsers().contains(user));
        verify(sessionRepository).save(session);
    }

    @Test
    void noLongerParticipate_shouldThrowNotFoundIfSessionMissing() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 42L));
    }

    @Test
    void noLongerParticipate_shouldThrowBadRequestIfUserNotParticipant() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 42L));
    }
}
