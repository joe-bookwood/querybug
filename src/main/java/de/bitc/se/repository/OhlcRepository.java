package de.bitc.se.repository;

import de.bitc.se.domain.Ohlc;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Ohlc entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OhlcRepository extends JpaRepository<Ohlc, Long> {}
