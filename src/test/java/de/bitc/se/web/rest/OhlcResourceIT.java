package de.bitc.se.web.rest;

import static de.bitc.se.web.rest.TestUtil.sameInstant;
import static de.bitc.se.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import de.bitc.se.IntegrationTest;
import de.bitc.se.domain.Chart;
import de.bitc.se.domain.Ohlc;
import de.bitc.se.repository.OhlcRepository;
import java.math.BigDecimal;
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
 * Integration tests for the {@link OhlcResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OhlcResourceIT {

    private static final ZonedDateTime DEFAULT_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final BigDecimal DEFAULT_OPEN = new BigDecimal(1);
    private static final BigDecimal UPDATED_OPEN = new BigDecimal(2);

    private static final BigDecimal DEFAULT_HIGH = new BigDecimal(1);
    private static final BigDecimal UPDATED_HIGH = new BigDecimal(2);

    private static final BigDecimal DEFAULT_LOW = new BigDecimal(1);
    private static final BigDecimal UPDATED_LOW = new BigDecimal(2);

    private static final BigDecimal DEFAULT_CLOSE = new BigDecimal(1);
    private static final BigDecimal UPDATED_CLOSE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_VOLUME_WEIGHTED_AVERAGE_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_VOLUME_WEIGHTED_AVERAGE_PRICE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_VOLUME = new BigDecimal(1);
    private static final BigDecimal UPDATED_VOLUME = new BigDecimal(2);

    private static final Integer DEFAULT_COUNT = 1;
    private static final Integer UPDATED_COUNT = 2;

    private static final String ENTITY_API_URL = "/api/ohlcs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OhlcRepository ohlcRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOhlcMockMvc;

    private Ohlc ohlc;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ohlc createEntity(EntityManager em) {
        Ohlc ohlc = new Ohlc()
            .time(DEFAULT_TIME)
            .open(DEFAULT_OPEN)
            .high(DEFAULT_HIGH)
            .low(DEFAULT_LOW)
            .close(DEFAULT_CLOSE)
            .volumeWeightedAveragePrice(DEFAULT_VOLUME_WEIGHTED_AVERAGE_PRICE)
            .volume(DEFAULT_VOLUME)
            .count(DEFAULT_COUNT);
        // Add required entity
        Chart chart;
        if (TestUtil.findAll(em, Chart.class).isEmpty()) {
            chart = ChartResourceIT.createEntity(em);
            em.persist(chart);
            em.flush();
        } else {
            chart = TestUtil.findAll(em, Chart.class).get(0);
        }
        ohlc.setChart(chart);
        return ohlc;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ohlc createUpdatedEntity(EntityManager em) {
        Ohlc ohlc = new Ohlc()
            .time(UPDATED_TIME)
            .open(UPDATED_OPEN)
            .high(UPDATED_HIGH)
            .low(UPDATED_LOW)
            .close(UPDATED_CLOSE)
            .volumeWeightedAveragePrice(UPDATED_VOLUME_WEIGHTED_AVERAGE_PRICE)
            .volume(UPDATED_VOLUME)
            .count(UPDATED_COUNT);
        // Add required entity
        Chart chart;
        if (TestUtil.findAll(em, Chart.class).isEmpty()) {
            chart = ChartResourceIT.createUpdatedEntity(em);
            em.persist(chart);
            em.flush();
        } else {
            chart = TestUtil.findAll(em, Chart.class).get(0);
        }
        ohlc.setChart(chart);
        return ohlc;
    }

    @BeforeEach
    public void initTest() {
        ohlc = createEntity(em);
    }

    @Test
    @Transactional
    void createOhlc() throws Exception {
        int databaseSizeBeforeCreate = ohlcRepository.findAll().size();
        // Create the Ohlc
        restOhlcMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ohlc)))
            .andExpect(status().isCreated());

        // Validate the Ohlc in the database
        List<Ohlc> ohlcList = ohlcRepository.findAll();
        assertThat(ohlcList).hasSize(databaseSizeBeforeCreate + 1);
        Ohlc testOhlc = ohlcList.get(ohlcList.size() - 1);
        assertThat(testOhlc.getTime()).isEqualTo(DEFAULT_TIME);
        assertThat(testOhlc.getOpen()).isEqualByComparingTo(DEFAULT_OPEN);
        assertThat(testOhlc.getHigh()).isEqualByComparingTo(DEFAULT_HIGH);
        assertThat(testOhlc.getLow()).isEqualByComparingTo(DEFAULT_LOW);
        assertThat(testOhlc.getClose()).isEqualByComparingTo(DEFAULT_CLOSE);
        assertThat(testOhlc.getVolumeWeightedAveragePrice()).isEqualByComparingTo(DEFAULT_VOLUME_WEIGHTED_AVERAGE_PRICE);
        assertThat(testOhlc.getVolume()).isEqualByComparingTo(DEFAULT_VOLUME);
        assertThat(testOhlc.getCount()).isEqualTo(DEFAULT_COUNT);
    }

    @Test
    @Transactional
    void createOhlcWithExistingId() throws Exception {
        // Create the Ohlc with an existing ID
        ohlc.setId(1L);

        int databaseSizeBeforeCreate = ohlcRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOhlcMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ohlc)))
            .andExpect(status().isBadRequest());

        // Validate the Ohlc in the database
        List<Ohlc> ohlcList = ohlcRepository.findAll();
        assertThat(ohlcList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOhlcs() throws Exception {
        // Initialize the database
        ohlcRepository.saveAndFlush(ohlc);

        // Get all the ohlcList
        restOhlcMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ohlc.getId().intValue())))
            .andExpect(jsonPath("$.[*].time").value(hasItem(sameInstant(DEFAULT_TIME))))
            .andExpect(jsonPath("$.[*].open").value(hasItem(sameNumber(DEFAULT_OPEN))))
            .andExpect(jsonPath("$.[*].high").value(hasItem(sameNumber(DEFAULT_HIGH))))
            .andExpect(jsonPath("$.[*].low").value(hasItem(sameNumber(DEFAULT_LOW))))
            .andExpect(jsonPath("$.[*].close").value(hasItem(sameNumber(DEFAULT_CLOSE))))
            .andExpect(jsonPath("$.[*].volumeWeightedAveragePrice").value(hasItem(sameNumber(DEFAULT_VOLUME_WEIGHTED_AVERAGE_PRICE))))
            .andExpect(jsonPath("$.[*].volume").value(hasItem(sameNumber(DEFAULT_VOLUME))))
            .andExpect(jsonPath("$.[*].count").value(hasItem(DEFAULT_COUNT)));
    }

    @Test
    @Transactional
    void getOhlc() throws Exception {
        // Initialize the database
        ohlcRepository.saveAndFlush(ohlc);

        // Get the ohlc
        restOhlcMockMvc
            .perform(get(ENTITY_API_URL_ID, ohlc.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ohlc.getId().intValue()))
            .andExpect(jsonPath("$.time").value(sameInstant(DEFAULT_TIME)))
            .andExpect(jsonPath("$.open").value(sameNumber(DEFAULT_OPEN)))
            .andExpect(jsonPath("$.high").value(sameNumber(DEFAULT_HIGH)))
            .andExpect(jsonPath("$.low").value(sameNumber(DEFAULT_LOW)))
            .andExpect(jsonPath("$.close").value(sameNumber(DEFAULT_CLOSE)))
            .andExpect(jsonPath("$.volumeWeightedAveragePrice").value(sameNumber(DEFAULT_VOLUME_WEIGHTED_AVERAGE_PRICE)))
            .andExpect(jsonPath("$.volume").value(sameNumber(DEFAULT_VOLUME)))
            .andExpect(jsonPath("$.count").value(DEFAULT_COUNT));
    }

    @Test
    @Transactional
    void getNonExistingOhlc() throws Exception {
        // Get the ohlc
        restOhlcMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOhlc() throws Exception {
        // Initialize the database
        ohlcRepository.saveAndFlush(ohlc);

        int databaseSizeBeforeUpdate = ohlcRepository.findAll().size();

        // Update the ohlc
        Ohlc updatedOhlc = ohlcRepository.findById(ohlc.getId()).get();
        // Disconnect from session so that the updates on updatedOhlc are not directly saved in db
        em.detach(updatedOhlc);
        updatedOhlc
            .time(UPDATED_TIME)
            .open(UPDATED_OPEN)
            .high(UPDATED_HIGH)
            .low(UPDATED_LOW)
            .close(UPDATED_CLOSE)
            .volumeWeightedAveragePrice(UPDATED_VOLUME_WEIGHTED_AVERAGE_PRICE)
            .volume(UPDATED_VOLUME)
            .count(UPDATED_COUNT);

        restOhlcMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOhlc.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOhlc))
            )
            .andExpect(status().isOk());

        // Validate the Ohlc in the database
        List<Ohlc> ohlcList = ohlcRepository.findAll();
        assertThat(ohlcList).hasSize(databaseSizeBeforeUpdate);
        Ohlc testOhlc = ohlcList.get(ohlcList.size() - 1);
        assertThat(testOhlc.getTime()).isEqualTo(UPDATED_TIME);
        assertThat(testOhlc.getOpen()).isEqualByComparingTo(UPDATED_OPEN);
        assertThat(testOhlc.getHigh()).isEqualByComparingTo(UPDATED_HIGH);
        assertThat(testOhlc.getLow()).isEqualByComparingTo(UPDATED_LOW);
        assertThat(testOhlc.getClose()).isEqualByComparingTo(UPDATED_CLOSE);
        assertThat(testOhlc.getVolumeWeightedAveragePrice()).isEqualByComparingTo(UPDATED_VOLUME_WEIGHTED_AVERAGE_PRICE);
        assertThat(testOhlc.getVolume()).isEqualByComparingTo(UPDATED_VOLUME);
        assertThat(testOhlc.getCount()).isEqualTo(UPDATED_COUNT);
    }

    @Test
    @Transactional
    void putNonExistingOhlc() throws Exception {
        int databaseSizeBeforeUpdate = ohlcRepository.findAll().size();
        ohlc.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOhlcMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ohlc.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ohlc))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ohlc in the database
        List<Ohlc> ohlcList = ohlcRepository.findAll();
        assertThat(ohlcList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOhlc() throws Exception {
        int databaseSizeBeforeUpdate = ohlcRepository.findAll().size();
        ohlc.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOhlcMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ohlc))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ohlc in the database
        List<Ohlc> ohlcList = ohlcRepository.findAll();
        assertThat(ohlcList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOhlc() throws Exception {
        int databaseSizeBeforeUpdate = ohlcRepository.findAll().size();
        ohlc.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOhlcMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ohlc)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ohlc in the database
        List<Ohlc> ohlcList = ohlcRepository.findAll();
        assertThat(ohlcList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOhlcWithPatch() throws Exception {
        // Initialize the database
        ohlcRepository.saveAndFlush(ohlc);

        int databaseSizeBeforeUpdate = ohlcRepository.findAll().size();

        // Update the ohlc using partial update
        Ohlc partialUpdatedOhlc = new Ohlc();
        partialUpdatedOhlc.setId(ohlc.getId());

        partialUpdatedOhlc
            .time(UPDATED_TIME)
            .volumeWeightedAveragePrice(UPDATED_VOLUME_WEIGHTED_AVERAGE_PRICE)
            .volume(UPDATED_VOLUME)
            .count(UPDATED_COUNT);

        restOhlcMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOhlc.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOhlc))
            )
            .andExpect(status().isOk());

        // Validate the Ohlc in the database
        List<Ohlc> ohlcList = ohlcRepository.findAll();
        assertThat(ohlcList).hasSize(databaseSizeBeforeUpdate);
        Ohlc testOhlc = ohlcList.get(ohlcList.size() - 1);
        assertThat(testOhlc.getTime()).isEqualTo(UPDATED_TIME);
        assertThat(testOhlc.getOpen()).isEqualByComparingTo(DEFAULT_OPEN);
        assertThat(testOhlc.getHigh()).isEqualByComparingTo(DEFAULT_HIGH);
        assertThat(testOhlc.getLow()).isEqualByComparingTo(DEFAULT_LOW);
        assertThat(testOhlc.getClose()).isEqualByComparingTo(DEFAULT_CLOSE);
        assertThat(testOhlc.getVolumeWeightedAveragePrice()).isEqualByComparingTo(UPDATED_VOLUME_WEIGHTED_AVERAGE_PRICE);
        assertThat(testOhlc.getVolume()).isEqualByComparingTo(UPDATED_VOLUME);
        assertThat(testOhlc.getCount()).isEqualTo(UPDATED_COUNT);
    }

    @Test
    @Transactional
    void fullUpdateOhlcWithPatch() throws Exception {
        // Initialize the database
        ohlcRepository.saveAndFlush(ohlc);

        int databaseSizeBeforeUpdate = ohlcRepository.findAll().size();

        // Update the ohlc using partial update
        Ohlc partialUpdatedOhlc = new Ohlc();
        partialUpdatedOhlc.setId(ohlc.getId());

        partialUpdatedOhlc
            .time(UPDATED_TIME)
            .open(UPDATED_OPEN)
            .high(UPDATED_HIGH)
            .low(UPDATED_LOW)
            .close(UPDATED_CLOSE)
            .volumeWeightedAveragePrice(UPDATED_VOLUME_WEIGHTED_AVERAGE_PRICE)
            .volume(UPDATED_VOLUME)
            .count(UPDATED_COUNT);

        restOhlcMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOhlc.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOhlc))
            )
            .andExpect(status().isOk());

        // Validate the Ohlc in the database
        List<Ohlc> ohlcList = ohlcRepository.findAll();
        assertThat(ohlcList).hasSize(databaseSizeBeforeUpdate);
        Ohlc testOhlc = ohlcList.get(ohlcList.size() - 1);
        assertThat(testOhlc.getTime()).isEqualTo(UPDATED_TIME);
        assertThat(testOhlc.getOpen()).isEqualByComparingTo(UPDATED_OPEN);
        assertThat(testOhlc.getHigh()).isEqualByComparingTo(UPDATED_HIGH);
        assertThat(testOhlc.getLow()).isEqualByComparingTo(UPDATED_LOW);
        assertThat(testOhlc.getClose()).isEqualByComparingTo(UPDATED_CLOSE);
        assertThat(testOhlc.getVolumeWeightedAveragePrice()).isEqualByComparingTo(UPDATED_VOLUME_WEIGHTED_AVERAGE_PRICE);
        assertThat(testOhlc.getVolume()).isEqualByComparingTo(UPDATED_VOLUME);
        assertThat(testOhlc.getCount()).isEqualTo(UPDATED_COUNT);
    }

    @Test
    @Transactional
    void patchNonExistingOhlc() throws Exception {
        int databaseSizeBeforeUpdate = ohlcRepository.findAll().size();
        ohlc.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOhlcMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ohlc.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ohlc))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ohlc in the database
        List<Ohlc> ohlcList = ohlcRepository.findAll();
        assertThat(ohlcList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOhlc() throws Exception {
        int databaseSizeBeforeUpdate = ohlcRepository.findAll().size();
        ohlc.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOhlcMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ohlc))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ohlc in the database
        List<Ohlc> ohlcList = ohlcRepository.findAll();
        assertThat(ohlcList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOhlc() throws Exception {
        int databaseSizeBeforeUpdate = ohlcRepository.findAll().size();
        ohlc.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOhlcMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(ohlc)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ohlc in the database
        List<Ohlc> ohlcList = ohlcRepository.findAll();
        assertThat(ohlcList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOhlc() throws Exception {
        // Initialize the database
        ohlcRepository.saveAndFlush(ohlc);

        int databaseSizeBeforeDelete = ohlcRepository.findAll().size();

        // Delete the ohlc
        restOhlcMockMvc
            .perform(delete(ENTITY_API_URL_ID, ohlc.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ohlc> ohlcList = ohlcRepository.findAll();
        assertThat(ohlcList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
