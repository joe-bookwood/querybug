package de.bitc.se.repository;

import de.bitc.se.domain.Chart;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Chart entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChartRepository extends JpaRepository<Chart, Long> {}
