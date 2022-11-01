package de.bitc.se.repository;

import de.bitc.se.domain.Calculation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Calculation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CalculationRepository extends JpaRepository<Calculation, Long> {}
