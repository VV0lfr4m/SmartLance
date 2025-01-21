package com.smartlance.services.arbitration;

import com.smartlance.models.Arbitration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class ArbitrationService implements IArbitrationService {
    private ArbitrationRepository arbitrationRepository;
    /*private Web3j web3j;
    private TransactionManager transactionManager;*/

    public ArbitrationService(ArbitrationRepository arbitrationRepository/*, Web3j web3j, TransactionManager transactionManager*/) {
        this.arbitrationRepository = arbitrationRepository;
        /*this.web3j = web3j;
        this.transactionManager = transactionManager;*/
    }

    public Arbitration initializeArbitration(Long taskId, String owner, String executor, BigDecimal budget, String arbiter) {
        // Створення арбітражу
        Arbitration arbitration = new Arbitration();
        arbitration.setTaskId(taskId);
        arbitration.setOwnerAddress(owner);
        arbitration.setExecutorAddress(executor);
        arbitration.setArbiterAddress(arbiter);
        arbitration.setBudget(budget);
        arbitration.setResolved(false);

        // Зберігаємо в базу
        return arbitrationRepository.save(arbitration);
    }

    public Optional<Arbitration> getArbitrationByTaskId(Long taskId) {
        return arbitrationRepository.findById(taskId);
    }

    public Arbitration resolveArbitration(Long taskId, String winner) {
        Arbitration arbitration = arbitrationRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Arbitration not found"));

        if (arbitration.isResolved()) {
            throw new RuntimeException("Arbitration already resolved");
        }

        // Встановлення переможця
        arbitration.setResolved(true);
        arbitration.setWinner(winner);

        // TODO: Виклик контракту для передачі коштів переможцю
        // Example:
        // arbitrationManager.resolveArbitration(taskId, winner);

        return arbitrationRepository.save(arbitration);
    }

    public void finalizeArbitration(Long taskId) {
        Arbitration arbitration = arbitrationRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Arbitration not found"));

        if (!arbitration.isResolved()) {
            throw new RuntimeException("Arbitration is not resolved");
        }

        // TODO: Виклик контракту для фіналізації
        arbitrationRepository.deleteById(taskId);
    }
}
