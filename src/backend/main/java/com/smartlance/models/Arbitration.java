package com.smartlance.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "arbitrations")
public class Arbitration {
    @Id
    private Long taskId; // ID завдання як ключ

    @Column(nullable = false)
    private String ownerAddress; // Адреса власника

    @Column(nullable = false)
    private String executorAddress; // Адреса виконавця

    @Column(nullable = false)
    private String arbiterAddress; // Адреса арбітра

    @Column(nullable = false)
    private BigDecimal budget; // Заблоковані кошти

    @Column(nullable = false)
    private boolean resolved;

    private String winner; // Адреса переможця

    // Getters and Setters
    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getOwnerAddress() {
        return ownerAddress;
    }

    public void setOwnerAddress(String ownerAddress) {
        this.ownerAddress = ownerAddress;
    }

    public String getExecutorAddress() {
        return executorAddress;
    }

    public void setExecutorAddress(String executorAddress) {
        this.executorAddress = executorAddress;
    }

    public String getArbiterAddress() {
        return arbiterAddress;
    }

    public void setArbiterAddress(String arbiterAddress) {
        this.arbiterAddress = arbiterAddress;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public boolean isResolved() {
        return resolved;
    }

    public void setResolved(boolean resolved) {
        this.resolved = resolved;
    }

    public String getWinner() {
        return winner;
    }

    public void setWinner(String winner) {
        this.winner = winner;
    }
}
