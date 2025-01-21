package com.smartlance.services.arbitration;


import com.smartlance.models.Arbitration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArbitrationRepository extends JpaRepository<Arbitration, Long> {
}