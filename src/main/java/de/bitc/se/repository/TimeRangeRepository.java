package de.bitc.se.repository;

import de.bitc.se.domain.TimeRange;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TimeRange entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TimeRangeRepository extends JpaRepository<TimeRange, Long> {}
