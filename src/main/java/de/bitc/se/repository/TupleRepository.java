package de.bitc.se.repository;

import de.bitc.se.domain.Tuple;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Tuple entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TupleRepository extends JpaRepository<Tuple, Long> {}
