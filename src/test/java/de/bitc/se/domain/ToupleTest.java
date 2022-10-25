package de.bitc.se.domain;

import static org.assertj.core.api.Assertions.assertThat;

import de.bitc.se.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ToupleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Touple.class);
        Touple touple1 = new Touple();
        touple1.setId(1L);
        Touple touple2 = new Touple();
        touple2.setId(touple1.getId());
        assertThat(touple1).isEqualTo(touple2);
        touple2.setId(2L);
        assertThat(touple1).isNotEqualTo(touple2);
        touple1.setId(null);
        assertThat(touple1).isNotEqualTo(touple2);
    }
}
