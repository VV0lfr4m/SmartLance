package com.smartlance.services.arbitration;

import com.smartlance.models.Arbitration;

import java.math.BigDecimal;
import java.util.Optional;

public interface IArbitrationService {
    Arbitration initializeArbitration(Arbitration arbitration);
    Optional<Arbitration> getArbitrationByTaskId(Long taskId);
    Arbitration resolveArbitration(Long taskId, String winner);
    void finalizeArbitration(Long taskId);
}
