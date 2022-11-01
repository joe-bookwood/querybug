package de.bitc.se.domain;

import static org.assertj.core.api.Assertions.assertThat;

import de.bitc.se.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OhlcTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ohlc.class);
        Ohlc ohlc1 = new Ohlc();
        ohlc1.setId(1L);
        Ohlc ohlc2 = new Ohlc();
        ohlc2.setId(ohlc1.getId());
        assertThat(ohlc1).isEqualTo(ohlc2);
        ohlc2.setId(2L);
        assertThat(ohlc1).isNotEqualTo(ohlc2);
        ohlc1.setId(null);
        assertThat(ohlc1).isNotEqualTo(ohlc2);
    }
}
