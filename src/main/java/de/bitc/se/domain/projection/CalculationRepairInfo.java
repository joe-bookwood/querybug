package de.bitc.se.domain.projection;

import java.time.ZonedDateTime;

/**
 * A Projection for the {@link de.bitc.se.domain.Calculation} entity
 */
public interface CalculationRepairInfo {
    ZonedDateTime getTime();

    Integer getSize();
}
