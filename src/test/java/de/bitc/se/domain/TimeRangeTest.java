package de.bitc.se.domain;

import static org.assertj.core.api.Assertions.assertThat;

import de.bitc.se.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TimeRangeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TimeRange.class);
        TimeRange timeRange1 = new TimeRange();
        timeRange1.setId(1L);
        TimeRange timeRange2 = new TimeRange();
        timeRange2.setId(timeRange1.getId());
        assertThat(timeRange1).isEqualTo(timeRange2);
        timeRange2.setId(2L);
        assertThat(timeRange1).isNotEqualTo(timeRange2);
        timeRange1.setId(null);
        assertThat(timeRange1).isNotEqualTo(timeRange2);
    }
}
