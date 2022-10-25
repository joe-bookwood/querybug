package de.bitc.se.domain;

import static org.assertj.core.api.Assertions.assertThat;

import de.bitc.se.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PairTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pair.class);
        Pair pair1 = new Pair();
        pair1.setId(1L);
        Pair pair2 = new Pair();
        pair2.setId(pair1.getId());
        assertThat(pair1).isEqualTo(pair2);
        pair2.setId(2L);
        assertThat(pair1).isNotEqualTo(pair2);
        pair1.setId(null);
        assertThat(pair1).isNotEqualTo(pair2);
    }
}
