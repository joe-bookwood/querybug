package de.bitc.se.repository;

import de.bitc.se.domain.Touple;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Touple entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ToupleRepository extends JpaRepository<Touple, Long> {}
