package de.bitc.se.repository;

import de.bitc.se.domain.Pair;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Pair entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PairRepository extends JpaRepository<Pair, Long> {}
