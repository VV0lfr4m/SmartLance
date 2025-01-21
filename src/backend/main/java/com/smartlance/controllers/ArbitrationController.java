package com.smartlance.controllers;

import com.smartlance.models.Arbitration;
import com.smartlance.services.arbitration.IArbitrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping("/arbitrations")
public class ArbitrationController {
    private IArbitrationService arbitrationService;

    public ArbitrationController(IArbitrationService arbitrationService) {
        this.arbitrationService = arbitrationService;
    }

    @PostMapping
    public ResponseEntity<Arbitration> initiateArbitration(
            @RequestParam Long taskId,
            @RequestParam String owner,
            @RequestParam String executor,
            @RequestParam BigDecimal budget,
            @RequestParam String arbiter
    ) {
        Arbitration arbitration = arbitrationService.initializeArbitration(taskId, owner, executor, budget, arbiter);
        return ResponseEntity.ok(arbitration);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<Arbitration> getArbitration(@PathVariable Long taskId) {
        Optional<Arbitration> arbitration = arbitrationService.getArbitrationByTaskId(taskId);
        return arbitration.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{taskId}/resolve")
    public ResponseEntity<Arbitration> resolveArbitration(
            @PathVariable Long taskId,
            @RequestParam String winner
    ) {
        Arbitration arbitration = arbitrationService.resolveArbitration(taskId, winner);
        return ResponseEntity.ok(arbitration);
    }

    @PutMapping("/{taskId}/finalize")
    public ResponseEntity<String> finalizeArbitration(@PathVariable Long taskId) {
        arbitrationService.finalizeArbitration(taskId);
        return ResponseEntity.ok("Arbitration finalized for task: " + taskId);
    }
}
