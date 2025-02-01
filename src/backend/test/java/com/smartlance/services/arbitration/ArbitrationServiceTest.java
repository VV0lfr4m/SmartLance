package com.smartlance.services.arbitration;

import com.smartlance.models.Arbitration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ArbitrationServiceTest {

    @Mock
    private ArbitrationRepository arbitrationRepository;

    @InjectMocks
    private ArbitrationService arbitrationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void initializeArbitration_ShouldSaveArbitration() {
        // Arrange
        Arbitration arbitration = new Arbitration();
        arbitration.setTaskId(1L);
        arbitration.setResolved(false);

        when(arbitrationRepository.save(any(Arbitration.class))).thenReturn(arbitration);

        // Act
        Arbitration savedArbitration = arbitrationService.initializeArbitration(arbitration);

        // Assert
        assertNotNull(savedArbitration);
        assertFalse(savedArbitration.isResolved());
        verify(arbitrationRepository, times(1)).save(arbitration);
    }

    @Test
    void getArbitrationByTaskId_ShouldReturnArbitration_WhenExists() {
        // Arrange
        Long taskId = 1L;
        Arbitration arbitration = new Arbitration();
        arbitration.setTaskId(taskId);

        when(arbitrationRepository.findById(taskId)).thenReturn(Optional.of(arbitration));

        // Act
        Optional<Arbitration> foundArbitration = arbitrationService.getArbitrationByTaskId(taskId);

        // Assert
        assertTrue(foundArbitration.isPresent());
        assertEquals(taskId, foundArbitration.get().getTaskId());
        verify(arbitrationRepository, times(1)).findById(taskId);
    }

    @Test
    void getArbitrationByTaskId_ShouldReturnEmpty_WhenNotExists() {
        // Arrange
        Long taskId = 2L;

        when(arbitrationRepository.findById(taskId)).thenReturn(Optional.empty());

        // Act
        Optional<Arbitration> foundArbitration = arbitrationService.getArbitrationByTaskId(taskId);

        // Assert
        assertFalse(foundArbitration.isPresent());
        verify(arbitrationRepository, times(1)).findById(taskId);
    }

    @Test
    void resolveArbitration_ShouldSetWinnerAndSave() {
        // Arrange
        Long taskId = 1L;
        String winner = "0xWinnerAddress";

        Arbitration arbitration = new Arbitration();
        arbitration.setTaskId(taskId);
        arbitration.setResolved(false);

        when(arbitrationRepository.findById(taskId)).thenReturn(Optional.of(arbitration));
        when(arbitrationRepository.save(any(Arbitration.class))).thenReturn(arbitration);

        // Act
        Arbitration resolvedArbitration = arbitrationService.resolveArbitration(taskId, winner);

        // Assert
        assertTrue(resolvedArbitration.isResolved());
        assertEquals(winner, resolvedArbitration.getWinner());
        verify(arbitrationRepository, times(1)).save(arbitration);
    }

    @Test
    void resolveArbitration_ShouldThrowException_WhenAlreadyResolved() {
        // Arrange
        Long taskId = 1L;
        String winner = "0xWinnerAddress";

        Arbitration arbitration = new Arbitration();
        arbitration.setTaskId(taskId);
        arbitration.setResolved(true);

        when(arbitrationRepository.findById(taskId)).thenReturn(Optional.of(arbitration));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> arbitrationService.resolveArbitration(taskId, winner));

        assertEquals("Arbitration already resolved", exception.getMessage());
        verify(arbitrationRepository, never()).save(any(Arbitration.class));
    }

    @Test
    void finalizeArbitration_ShouldDeleteArbitration_WhenResolved() {
        // Arrange
        Long taskId = 1L;
        Arbitration arbitration = new Arbitration();
        arbitration.setTaskId(taskId);
        arbitration.setResolved(true);

        when(arbitrationRepository.findById(taskId)).thenReturn(Optional.of(arbitration));
        doNothing().when(arbitrationRepository).deleteById(taskId);

        // Act
        arbitrationService.finalizeArbitration(taskId);

        // Assert
        verify(arbitrationRepository, times(1)).deleteById(taskId);
    }

    @Test
    void finalizeArbitration_ShouldThrowException_WhenNotResolved() {
        // Arrange
        Long taskId = 1L;
        Arbitration arbitration = new Arbitration();
        arbitration.setTaskId(taskId);
        arbitration.setResolved(false);

        when(arbitrationRepository.findById(taskId)).thenReturn(Optional.of(arbitration));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> arbitrationService.finalizeArbitration(taskId));

        assertEquals("Arbitration is not resolved", exception.getMessage());
        verify(arbitrationRepository, never()).deleteById(taskId);
    }
}
