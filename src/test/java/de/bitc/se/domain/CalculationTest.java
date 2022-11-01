package de.bitc.se.domain;

import static org.assertj.core.api.Assertions.assertThat;

import de.bitc.se.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CalculationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Calculation.class);
        Calculation calculation1 = new Calculation();
        calculation1.setId(1L);
        Calculation calculation2 = new Calculation();
        calculation2.setId(calculation1.getId());
        assertThat(calculation1).isEqualTo(calculation2);
        calculation2.setId(2L);
        assertThat(calculation1).isNotEqualTo(calculation2);
        calculation1.setId(null);
        assertThat(calculation1).isNotEqualTo(calculation2);
    }
}
