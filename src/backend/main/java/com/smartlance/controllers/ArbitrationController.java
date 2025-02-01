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
    public ResponseEntity<Arbitration> initiateArbitration(@RequestBody Arbitration arbitration) {
        return ResponseEntity.ok(arbitrationService.initializeArbitration(arbitration));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<Arbitration> getArbitration(@PathVariable Long taskId) {
        Optional<Arbitration> arbitration = arbitrationService.getArbitrationByTaskId(taskId);
        return arbitration.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{taskId}/resolve")
    public ResponseEntity<Arbitration> resolveArbitration(
            @PathVariable Long taskId,
            @RequestParam String winner
    ) {
        Arbitration arbitration = arbitrationService.resolveArbitration(taskId, winner);
        return ResponseEntity.ok(arbitration);
    }

    @PostMapping("/{taskId}/finalize")
    public ResponseEntity<String> finalizeArbitration(@PathVariable Long taskId) {
        arbitrationService.finalizeArbitration(taskId);
        return ResponseEntity.ok("Arbitration finalized for task: " + taskId);
    }
}
