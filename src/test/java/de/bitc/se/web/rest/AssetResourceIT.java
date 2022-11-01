package de.bitc.se.web.rest;

import static de.bitc.se.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import de.bitc.se.IntegrationTest;
import de.bitc.se.domain.Asset;
import de.bitc.se.repository.AssetRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AssetResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AssetResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ASSET_CLASS = "AAAAAAAAAA";
    private static final String UPDATED_ASSET_CLASS = "BBBBBBBBBB";

    private static final String DEFAULT_ALTERNATIVE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ALTERNATIVE_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_DECIMALS = 1;
    private static final Integer UPDATED_DECIMALS = 2;

    private static final Integer DEFAULT_DISPLAY_DECIMALS = 1;
    private static final Integer UPDATED_DISPLAY_DECIMALS = 2;

    private static final ZonedDateTime DEFAULT_LAST_CHECKED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAST_CHECKED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/assets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAssetMockMvc;

    private Asset asset;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Asset createEntity(EntityManager em) {
        Asset asset = new Asset()
            .name(DEFAULT_NAME)
            .assetClass(DEFAULT_ASSET_CLASS)
            .alternativeName(DEFAULT_ALTERNATIVE_NAME)
            .decimals(DEFAULT_DECIMALS)
            .displayDecimals(DEFAULT_DISPLAY_DECIMALS)
            .lastChecked(DEFAULT_LAST_CHECKED);
        return asset;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Asset createUpdatedEntity(EntityManager em) {
        Asset asset = new Asset()
            .name(UPDATED_NAME)
            .assetClass(UPDATED_ASSET_CLASS)
            .alternativeName(UPDATED_ALTERNATIVE_NAME)
            .decimals(UPDATED_DECIMALS)
            .displayDecimals(UPDATED_DISPLAY_DECIMALS)
            .lastChecked(UPDATED_LAST_CHECKED);
        return asset;
    }

    @BeforeEach
    public void initTest() {
        asset = createEntity(em);
    }

    @Test
    @Transactional
    void createAsset() throws Exception {
        int databaseSizeBeforeCreate = assetRepository.findAll().size();
        // Create the Asset
        restAssetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(asset)))
            .andExpect(status().isCreated());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeCreate + 1);
        Asset testAsset = assetList.get(assetList.size() - 1);
        assertThat(testAsset.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAsset.getAssetClass()).isEqualTo(DEFAULT_ASSET_CLASS);
        assertThat(testAsset.getAlternativeName()).isEqualTo(DEFAULT_ALTERNATIVE_NAME);
        assertThat(testAsset.getDecimals()).isEqualTo(DEFAULT_DECIMALS);
        assertThat(testAsset.getDisplayDecimals()).isEqualTo(DEFAULT_DISPLAY_DECIMALS);
        assertThat(testAsset.getLastChecked()).isEqualTo(DEFAULT_LAST_CHECKED);
    }

    @Test
    @Transactional
    void createAssetWithExistingId() throws Exception {
        // Create the Asset with an existing ID
        asset.setId(1L);

        int databaseSizeBeforeCreate = assetRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAssetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(asset)))
            .andExpect(status().isBadRequest());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAssets() throws Exception {
        // Initialize the database
        assetRepository.saveAndFlush(asset);

        // Get all the assetList
        restAssetMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(asset.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].assetClass").value(hasItem(DEFAULT_ASSET_CLASS)))
            .andExpect(jsonPath("$.[*].alternativeName").value(hasItem(DEFAULT_ALTERNATIVE_NAME)))
            .andExpect(jsonPath("$.[*].decimals").value(hasItem(DEFAULT_DECIMALS)))
            .andExpect(jsonPath("$.[*].displayDecimals").value(hasItem(DEFAULT_DISPLAY_DECIMALS)))
            .andExpect(jsonPath("$.[*].lastChecked").value(hasItem(sameInstant(DEFAULT_LAST_CHECKED))));
    }

    @Test
    @Transactional
    void getAsset() throws Exception {
        // Initialize the database
        assetRepository.saveAndFlush(asset);

        // Get the asset
        restAssetMockMvc
            .perform(get(ENTITY_API_URL_ID, asset.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(asset.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.assetClass").value(DEFAULT_ASSET_CLASS))
            .andExpect(jsonPath("$.alternativeName").value(DEFAULT_ALTERNATIVE_NAME))
            .andExpect(jsonPath("$.decimals").value(DEFAULT_DECIMALS))
            .andExpect(jsonPath("$.displayDecimals").value(DEFAULT_DISPLAY_DECIMALS))
            .andExpect(jsonPath("$.lastChecked").value(sameInstant(DEFAULT_LAST_CHECKED)));
    }

    @Test
    @Transactional
    void getNonExistingAsset() throws Exception {
        // Get the asset
        restAssetMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAsset() throws Exception {
        // Initialize the database
        assetRepository.saveAndFlush(asset);

        int databaseSizeBeforeUpdate = assetRepository.findAll().size();

        // Update the asset
        Asset updatedAsset = assetRepository.findById(asset.getId()).get();
        // Disconnect from session so that the updates on updatedAsset are not directly saved in db
        em.detach(updatedAsset);
        updatedAsset
            .name(UPDATED_NAME)
            .assetClass(UPDATED_ASSET_CLASS)
            .alternativeName(UPDATED_ALTERNATIVE_NAME)
            .decimals(UPDATED_DECIMALS)
            .displayDecimals(UPDATED_DISPLAY_DECIMALS)
            .lastChecked(UPDATED_LAST_CHECKED);

        restAssetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAsset.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAsset))
            )
            .andExpect(status().isOk());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
        Asset testAsset = assetList.get(assetList.size() - 1);
        assertThat(testAsset.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAsset.getAssetClass()).isEqualTo(UPDATED_ASSET_CLASS);
        assertThat(testAsset.getAlternativeName()).isEqualTo(UPDATED_ALTERNATIVE_NAME);
        assertThat(testAsset.getDecimals()).isEqualTo(UPDATED_DECIMALS);
        assertThat(testAsset.getDisplayDecimals()).isEqualTo(UPDATED_DISPLAY_DECIMALS);
        assertThat(testAsset.getLastChecked()).isEqualTo(UPDATED_LAST_CHECKED);
    }

    @Test
    @Transactional
    void putNonExistingAsset() throws Exception {
        int databaseSizeBeforeUpdate = assetRepository.findAll().size();
        asset.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAssetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, asset.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(asset))
            )
            .andExpect(status().isBadRequest());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAsset() throws Exception {
        int databaseSizeBeforeUpdate = assetRepository.findAll().size();
        asset.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(asset))
            )
            .andExpect(status().isBadRequest());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAsset() throws Exception {
        int databaseSizeBeforeUpdate = assetRepository.findAll().size();
        asset.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssetMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(asset)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAssetWithPatch() throws Exception {
        // Initialize the database
        assetRepository.saveAndFlush(asset);

        int databaseSizeBeforeUpdate = assetRepository.findAll().size();

        // Update the asset using partial update
        Asset partialUpdatedAsset = new Asset();
        partialUpdatedAsset.setId(asset.getId());

        partialUpdatedAsset
            .name(UPDATED_NAME)
            .alternativeName(UPDATED_ALTERNATIVE_NAME)
            .displayDecimals(UPDATED_DISPLAY_DECIMALS)
            .lastChecked(UPDATED_LAST_CHECKED);

        restAssetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAsset.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAsset))
            )
            .andExpect(status().isOk());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
        Asset testAsset = assetList.get(assetList.size() - 1);
        assertThat(testAsset.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAsset.getAssetClass()).isEqualTo(DEFAULT_ASSET_CLASS);
        assertThat(testAsset.getAlternativeName()).isEqualTo(UPDATED_ALTERNATIVE_NAME);
        assertThat(testAsset.getDecimals()).isEqualTo(DEFAULT_DECIMALS);
        assertThat(testAsset.getDisplayDecimals()).isEqualTo(UPDATED_DISPLAY_DECIMALS);
        assertThat(testAsset.getLastChecked()).isEqualTo(UPDATED_LAST_CHECKED);
    }

    @Test
    @Transactional
    void fullUpdateAssetWithPatch() throws Exception {
        // Initialize the database
        assetRepository.saveAndFlush(asset);

        int databaseSizeBeforeUpdate = assetRepository.findAll().size();

        // Update the asset using partial update
        Asset partialUpdatedAsset = new Asset();
        partialUpdatedAsset.setId(asset.getId());

        partialUpdatedAsset
            .name(UPDATED_NAME)
            .assetClass(UPDATED_ASSET_CLASS)
            .alternativeName(UPDATED_ALTERNATIVE_NAME)
            .decimals(UPDATED_DECIMALS)
            .displayDecimals(UPDATED_DISPLAY_DECIMALS)
            .lastChecked(UPDATED_LAST_CHECKED);

        restAssetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAsset.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAsset))
            )
            .andExpect(status().isOk());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
        Asset testAsset = assetList.get(assetList.size() - 1);
        assertThat(testAsset.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAsset.getAssetClass()).isEqualTo(UPDATED_ASSET_CLASS);
        assertThat(testAsset.getAlternativeName()).isEqualTo(UPDATED_ALTERNATIVE_NAME);
        assertThat(testAsset.getDecimals()).isEqualTo(UPDATED_DECIMALS);
        assertThat(testAsset.getDisplayDecimals()).isEqualTo(UPDATED_DISPLAY_DECIMALS);
        assertThat(testAsset.getLastChecked()).isEqualTo(UPDATED_LAST_CHECKED);
    }

    @Test
    @Transactional
    void patchNonExistingAsset() throws Exception {
        int databaseSizeBeforeUpdate = assetRepository.findAll().size();
        asset.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAssetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, asset.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(asset))
            )
            .andExpect(status().isBadRequest());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAsset() throws Exception {
        int databaseSizeBeforeUpdate = assetRepository.findAll().size();
        asset.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(asset))
            )
            .andExpect(status().isBadRequest());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAsset() throws Exception {
        int databaseSizeBeforeUpdate = assetRepository.findAll().size();
        asset.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssetMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(asset)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAsset() throws Exception {
        // Initialize the database
        assetRepository.saveAndFlush(asset);

        int databaseSizeBeforeDelete = assetRepository.findAll().size();

        // Delete the asset
        restAssetMockMvc
            .perform(delete(ENTITY_API_URL_ID, asset.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
