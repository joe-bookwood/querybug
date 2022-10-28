package de.bitc.se.service.dto;

import de.bitc.se.domain.projection.CalculationRepairInfo;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Objects;

public class CalculationRepairDTO {

    private final ZonedDateTime time;

    private final Integer rangeSize;

    public CalculationRepairDTO(ZonedDateTime time, Integer rangeSize) {
        this.time = time;
        this.rangeSize = rangeSize;
    }

    public CalculationRepairDTO(CalculationRepairInfo calculationRepairInfo) {
        this.time = calculationRepairInfo.getTime().toInstant().atZone(ZoneId.of("Z"));
        this.rangeSize = calculationRepairInfo.getSize();
    }

    public ZonedDateTime getTime() {
        return time;
    }

    public Integer getRangeSize() {
        return rangeSize;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CalculationRepairDTO that = (CalculationRepairDTO) o;
        return time.equals(that.time) && rangeSize.equals(that.rangeSize);
    }

    @Override
    public int hashCode() {
        return Objects.hash(time, rangeSize);
    }
}
