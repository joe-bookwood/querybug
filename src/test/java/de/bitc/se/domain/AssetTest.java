package de.bitc.se.domain;

import static org.assertj.core.api.Assertions.assertThat;

import de.bitc.se.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AssetTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Asset.class);
        Asset asset1 = new Asset();
        asset1.setId(1L);
        Asset asset2 = new Asset();
        asset2.setId(asset1.getId());
        assertThat(asset1).isEqualTo(asset2);
        asset2.setId(2L);
        assertThat(asset1).isNotEqualTo(asset2);
        asset1.setId(null);
        assertThat(asset1).isNotEqualTo(asset2);
    }
}
