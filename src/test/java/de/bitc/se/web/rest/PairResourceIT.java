package de.bitc.se.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import de.bitc.se.IntegrationTest;
import de.bitc.se.domain.Asset;
import de.bitc.se.domain.Pair;
import de.bitc.se.repository.PairRepository;
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
 * Integration tests for the {@link PairResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PairResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ALTNAME = "AAAAAAAAAA";
    private static final String UPDATED_ALTNAME = "BBBBBBBBBB";

    private static final String DEFAULT_WEB_SOCKET_PAIR_NAME = "AAAAAAAAAA";
    private static final String UPDATED_WEB_SOCKET_PAIR_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LOT = "AAAAAAAAAA";
    private static final String UPDATED_LOT = "BBBBBBBBBB";

    private static final Integer DEFAULT_PAIR_DECIMAL = 1;
    private static final Integer UPDATED_PAIR_DECIMAL = 2;

    private static final Integer DEFAULT_LOT_DECIMALS = 1;
    private static final Integer UPDATED_LOT_DECIMALS = 2;

    private static final Integer DEFAULT_LOT_MULTIPLIER = 1;
    private static final Integer UPDATED_LOT_MULTIPLIER = 2;

    private static final String ENTITY_API_URL = "/api/pairs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PairRepository pairRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPairMockMvc;

    private Pair pair;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pair createEntity(EntityManager em) {
        Pair pair = new Pair()
            .name(DEFAULT_NAME)
            .altname(DEFAULT_ALTNAME)
            .webSocketPairName(DEFAULT_WEB_SOCKET_PAIR_NAME)
            .lot(DEFAULT_LOT)
            .pairDecimal(DEFAULT_PAIR_DECIMAL)
            .lotDecimals(DEFAULT_LOT_DECIMALS)
            .lotMultiplier(DEFAULT_LOT_MULTIPLIER);
        // Add required entity
        Asset asset;
        if (TestUtil.findAll(em, Asset.class).isEmpty()) {
            asset = AssetResourceIT.createEntity(em);
            em.persist(asset);
            em.flush();
        } else {
            asset = TestUtil.findAll(em, Asset.class).get(0);
        }
        pair.setBase(asset);
        // Add required entity
        pair.setQuote(asset);
        return pair;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pair createUpdatedEntity(EntityManager em) {
        Pair pair = new Pair()
            .name(UPDATED_NAME)
            .altname(UPDATED_ALTNAME)
            .webSocketPairName(UPDATED_WEB_SOCKET_PAIR_NAME)
            .lot(UPDATED_LOT)
            .pairDecimal(UPDATED_PAIR_DECIMAL)
            .lotDecimals(UPDATED_LOT_DECIMALS)
            .lotMultiplier(UPDATED_LOT_MULTIPLIER);
        // Add required entity
        Asset asset;
        if (TestUtil.findAll(em, Asset.class).isEmpty()) {
            asset = AssetResourceIT.createUpdatedEntity(em);
            em.persist(asset);
            em.flush();
        } else {
            asset = TestUtil.findAll(em, Asset.class).get(0);
        }
        pair.setBase(asset);
        // Add required entity
        pair.setQuote(asset);
        return pair;
    }

    @BeforeEach
    public void initTest() {
        pair = createEntity(em);
    }

    @Test
    @Transactional
    void createPair() throws Exception {
        int databaseSizeBeforeCreate = pairRepository.findAll().size();
        // Create the Pair
        restPairMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pair)))
            .andExpect(status().isCreated());

        // Validate the Pair in the database
        List<Pair> pairList = pairRepository.findAll();
        assertThat(pairList).hasSize(databaseSizeBeforeCreate + 1);
        Pair testPair = pairList.get(pairList.size() - 1);
        assertThat(testPair.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPair.getAltname()).isEqualTo(DEFAULT_ALTNAME);
        assertThat(testPair.getWebSocketPairName()).isEqualTo(DEFAULT_WEB_SOCKET_PAIR_NAME);
        assertThat(testPair.getLot()).isEqualTo(DEFAULT_LOT);
        assertThat(testPair.getPairDecimal()).isEqualTo(DEFAULT_PAIR_DECIMAL);
        assertThat(testPair.getLotDecimals()).isEqualTo(DEFAULT_LOT_DECIMALS);
        assertThat(testPair.getLotMultiplier()).isEqualTo(DEFAULT_LOT_MULTIPLIER);
    }

    @Test
    @Transactional
    void createPairWithExistingId() throws Exception {
        // Create the Pair with an existing ID
        pair.setId(1L);

        int databaseSizeBeforeCreate = pairRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPairMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pair)))
            .andExpect(status().isBadRequest());

        // Validate the Pair in the database
        List<Pair> pairList = pairRepository.findAll();
        assertThat(pairList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPairs() throws Exception {
        // Initialize the database
        pairRepository.saveAndFlush(pair);

        // Get all the pairList
        restPairMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pair.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].altname").value(hasItem(DEFAULT_ALTNAME)))
            .andExpect(jsonPath("$.[*].webSocketPairName").value(hasItem(DEFAULT_WEB_SOCKET_PAIR_NAME)))
            .andExpect(jsonPath("$.[*].lot").value(hasItem(DEFAULT_LOT)))
            .andExpect(jsonPath("$.[*].pairDecimal").value(hasItem(DEFAULT_PAIR_DECIMAL)))
            .andExpect(jsonPath("$.[*].lotDecimals").value(hasItem(DEFAULT_LOT_DECIMALS)))
            .andExpect(jsonPath("$.[*].lotMultiplier").value(hasItem(DEFAULT_LOT_MULTIPLIER)));
    }

    @Test
    @Transactional
    void getPair() throws Exception {
        // Initialize the database
        pairRepository.saveAndFlush(pair);

        // Get the pair
        restPairMockMvc
            .perform(get(ENTITY_API_URL_ID, pair.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pair.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.altname").value(DEFAULT_ALTNAME))
            .andExpect(jsonPath("$.webSocketPairName").value(DEFAULT_WEB_SOCKET_PAIR_NAME))
            .andExpect(jsonPath("$.lot").value(DEFAULT_LOT))
            .andExpect(jsonPath("$.pairDecimal").value(DEFAULT_PAIR_DECIMAL))
            .andExpect(jsonPath("$.lotDecimals").value(DEFAULT_LOT_DECIMALS))
            .andExpect(jsonPath("$.lotMultiplier").value(DEFAULT_LOT_MULTIPLIER));
    }

    @Test
    @Transactional
    void getNonExistingPair() throws Exception {
        // Get the pair
        restPairMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPair() throws Exception {
        // Initialize the database
        pairRepository.saveAndFlush(pair);

        int databaseSizeBeforeUpdate = pairRepository.findAll().size();

        // Update the pair
        Pair updatedPair = pairRepository.findById(pair.getId()).get();
        // Disconnect from session so that the updates on updatedPair are not directly saved in db
        em.detach(updatedPair);
        updatedPair
            .name(UPDATED_NAME)
            .altname(UPDATED_ALTNAME)
            .webSocketPairName(UPDATED_WEB_SOCKET_PAIR_NAME)
            .lot(UPDATED_LOT)
            .pairDecimal(UPDATED_PAIR_DECIMAL)
            .lotDecimals(UPDATED_LOT_DECIMALS)
            .lotMultiplier(UPDATED_LOT_MULTIPLIER);

        restPairMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPair.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPair))
            )
            .andExpect(status().isOk());

        // Validate the Pair in the database
        List<Pair> pairList = pairRepository.findAll();
        assertThat(pairList).hasSize(databaseSizeBeforeUpdate);
        Pair testPair = pairList.get(pairList.size() - 1);
        assertThat(testPair.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPair.getAltname()).isEqualTo(UPDATED_ALTNAME);
        assertThat(testPair.getWebSocketPairName()).isEqualTo(UPDATED_WEB_SOCKET_PAIR_NAME);
        assertThat(testPair.getLot()).isEqualTo(UPDATED_LOT);
        assertThat(testPair.getPairDecimal()).isEqualTo(UPDATED_PAIR_DECIMAL);
        assertThat(testPair.getLotDecimals()).isEqualTo(UPDATED_LOT_DECIMALS);
        assertThat(testPair.getLotMultiplier()).isEqualTo(UPDATED_LOT_MULTIPLIER);
    }

    @Test
    @Transactional
    void putNonExistingPair() throws Exception {
        int databaseSizeBeforeUpdate = pairRepository.findAll().size();
        pair.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPairMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pair.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pair))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pair in the database
        List<Pair> pairList = pairRepository.findAll();
        assertThat(pairList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPair() throws Exception {
        int databaseSizeBeforeUpdate = pairRepository.findAll().size();
        pair.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPairMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pair))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pair in the database
        List<Pair> pairList = pairRepository.findAll();
        assertThat(pairList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPair() throws Exception {
        int databaseSizeBeforeUpdate = pairRepository.findAll().size();
        pair.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPairMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pair)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pair in the database
        List<Pair> pairList = pairRepository.findAll();
        assertThat(pairList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePairWithPatch() throws Exception {
        // Initialize the database
        pairRepository.saveAndFlush(pair);

        int databaseSizeBeforeUpdate = pairRepository.findAll().size();

        // Update the pair using partial update
        Pair partialUpdatedPair = new Pair();
        partialUpdatedPair.setId(pair.getId());

        partialUpdatedPair.altname(UPDATED_ALTNAME).lot(UPDATED_LOT).pairDecimal(UPDATED_PAIR_DECIMAL);

        restPairMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPair.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPair))
            )
            .andExpect(status().isOk());

        // Validate the Pair in the database
        List<Pair> pairList = pairRepository.findAll();
        assertThat(pairList).hasSize(databaseSizeBeforeUpdate);
        Pair testPair = pairList.get(pairList.size() - 1);
        assertThat(testPair.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPair.getAltname()).isEqualTo(UPDATED_ALTNAME);
        assertThat(testPair.getWebSocketPairName()).isEqualTo(DEFAULT_WEB_SOCKET_PAIR_NAME);
        assertThat(testPair.getLot()).isEqualTo(UPDATED_LOT);
        assertThat(testPair.getPairDecimal()).isEqualTo(UPDATED_PAIR_DECIMAL);
        assertThat(testPair.getLotDecimals()).isEqualTo(DEFAULT_LOT_DECIMALS);
        assertThat(testPair.getLotMultiplier()).isEqualTo(DEFAULT_LOT_MULTIPLIER);
    }

    @Test
    @Transactional
    void fullUpdatePairWithPatch() throws Exception {
        // Initialize the database
        pairRepository.saveAndFlush(pair);

        int databaseSizeBeforeUpdate = pairRepository.findAll().size();

        // Update the pair using partial update
        Pair partialUpdatedPair = new Pair();
        partialUpdatedPair.setId(pair.getId());

        partialUpdatedPair
            .name(UPDATED_NAME)
            .altname(UPDATED_ALTNAME)
            .webSocketPairName(UPDATED_WEB_SOCKET_PAIR_NAME)
            .lot(UPDATED_LOT)
            .pairDecimal(UPDATED_PAIR_DECIMAL)
            .lotDecimals(UPDATED_LOT_DECIMALS)
            .lotMultiplier(UPDATED_LOT_MULTIPLIER);

        restPairMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPair.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPair))
            )
            .andExpect(status().isOk());

        // Validate the Pair in the database
        List<Pair> pairList = pairRepository.findAll();
        assertThat(pairList).hasSize(databaseSizeBeforeUpdate);
        Pair testPair = pairList.get(pairList.size() - 1);
        assertThat(testPair.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPair.getAltname()).isEqualTo(UPDATED_ALTNAME);
        assertThat(testPair.getWebSocketPairName()).isEqualTo(UPDATED_WEB_SOCKET_PAIR_NAME);
        assertThat(testPair.getLot()).isEqualTo(UPDATED_LOT);
        assertThat(testPair.getPairDecimal()).isEqualTo(UPDATED_PAIR_DECIMAL);
        assertThat(testPair.getLotDecimals()).isEqualTo(UPDATED_LOT_DECIMALS);
        assertThat(testPair.getLotMultiplier()).isEqualTo(UPDATED_LOT_MULTIPLIER);
    }

    @Test
    @Transactional
    void patchNonExistingPair() throws Exception {
        int databaseSizeBeforeUpdate = pairRepository.findAll().size();
        pair.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPairMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pair.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pair))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pair in the database
        List<Pair> pairList = pairRepository.findAll();
        assertThat(pairList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPair() throws Exception {
        int databaseSizeBeforeUpdate = pairRepository.findAll().size();
        pair.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPairMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pair))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pair in the database
        List<Pair> pairList = pairRepository.findAll();
        assertThat(pairList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPair() throws Exception {
        int databaseSizeBeforeUpdate = pairRepository.findAll().size();
        pair.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPairMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(pair)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pair in the database
        List<Pair> pairList = pairRepository.findAll();
        assertThat(pairList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePair() throws Exception {
        // Initialize the database
        pairRepository.saveAndFlush(pair);

        int databaseSizeBeforeDelete = pairRepository.findAll().size();

        // Delete the pair
        restPairMockMvc
            .perform(delete(ENTITY_API_URL_ID, pair.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Pair> pairList = pairRepository.findAll();
        assertThat(pairList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
