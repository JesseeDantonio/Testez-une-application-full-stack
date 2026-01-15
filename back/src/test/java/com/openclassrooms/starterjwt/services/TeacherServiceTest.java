package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    private Teacher teacher;

    @BeforeEach
    void setUp() {
        teacher = new Teacher();
        teacher.setId(1L);
        teacher.setLastName("Dupont");
    }

    @Test
    void findAll_shouldReturnListOfTeachers() {
        List<Teacher> teachers = Arrays.asList(teacher);
        when(teacherRepository.findAll()).thenReturn(teachers);

        List<Teacher> result = teacherService.findAll();

        assertEquals(teachers, result);
        verify(teacherRepository).findAll();
    }

    @Test
    void findById_shouldReturnTeacherIfExists() {
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        Teacher result = teacherService.findById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(teacherRepository).findById(1L);
    }

    @Test
    void findById_shouldReturnNullIfNotExists() {
        when(teacherRepository.findById(2L)).thenReturn(Optional.empty());

        Teacher result = teacherService.findById(2L);

        assertNull(result);
        verify(teacherRepository).findById(2L);
    }
}
