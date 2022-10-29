package de.bitc.se.domain;

import static org.assertj.core.api.Assertions.assertThat;

import de.bitc.se.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TupleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Tuple.class);
        Tuple tuple1 = new Tuple();
        tuple1.setId(1L);
        Tuple tuple2 = new Tuple();
        tuple2.setId(tuple1.getId());
        assertThat(tuple1).isEqualTo(tuple2);
        tuple2.setId(2L);
        assertThat(tuple1).isNotEqualTo(tuple2);
        tuple1.setId(null);
        assertThat(tuple1).isNotEqualTo(tuple2);
    }
}
