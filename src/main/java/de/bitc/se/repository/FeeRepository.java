package de.bitc.se.repository;

import de.bitc.se.domain.Fee;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Fee entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {}
