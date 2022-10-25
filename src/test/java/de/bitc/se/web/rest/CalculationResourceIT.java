package de.bitc.se.web.rest;

import static de.bitc.se.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import de.bitc.se.IntegrationTest;
import de.bitc.se.domain.Calculation;
import de.bitc.se.domain.Chart;
import de.bitc.se.repository.CalculationRepository;
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
 * Integration tests for the {@link CalculationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CalculationResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_LAST = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAST = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Boolean DEFAULT_DISABLED = false;
    private static final Boolean UPDATED_DISABLED = true;

    private static final String ENTITY_API_URL = "/api/calculations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CalculationRepository calculationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCalculationMockMvc;

    private Calculation calculation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Calculation createEntity(EntityManager em) {
        Calculation calculation = new Calculation().name(DEFAULT_NAME).last(DEFAULT_LAST).disabled(DEFAULT_DISABLED);
        // Add required entity
        Chart chart;
        if (TestUtil.findAll(em, Chart.class).isEmpty()) {
            chart = ChartResourceIT.createEntity(em);
            em.persist(chart);
            em.flush();
        } else {
            chart = TestUtil.findAll(em, Chart.class).get(0);
        }
        calculation.setChart(chart);
        return calculation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Calculation createUpdatedEntity(EntityManager em) {
        Calculation calculation = new Calculation().name(UPDATED_NAME).last(UPDATED_LAST).disabled(UPDATED_DISABLED);
        // Add required entity
        Chart chart;
        if (TestUtil.findAll(em, Chart.class).isEmpty()) {
            chart = ChartResourceIT.createUpdatedEntity(em);
            em.persist(chart);
            em.flush();
        } else {
            chart = TestUtil.findAll(em, Chart.class).get(0);
        }
        calculation.setChart(chart);
        return calculation;
    }

    @BeforeEach
    public void initTest() {
        calculation = createEntity(em);
    }

    @Test
    @Transactional
    void createCalculation() throws Exception {
        int databaseSizeBeforeCreate = calculationRepository.findAll().size();
        // Create the Calculation
        restCalculationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(calculation)))
            .andExpect(status().isCreated());

        // Validate the Calculation in the database
        List<Calculation> calculationList = calculationRepository.findAll();
        assertThat(calculationList).hasSize(databaseSizeBeforeCreate + 1);
        Calculation testCalculation = calculationList.get(calculationList.size() - 1);
        assertThat(testCalculation.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCalculation.getLast()).isEqualTo(DEFAULT_LAST);
        assertThat(testCalculation.getDisabled()).isEqualTo(DEFAULT_DISABLED);
    }

    @Test
    @Transactional
    void createCalculationWithExistingId() throws Exception {
        // Create the Calculation with an existing ID
        calculation.setId(1L);

        int databaseSizeBeforeCreate = calculationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCalculationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(calculation)))
            .andExpect(status().isBadRequest());

        // Validate the Calculation in the database
        List<Calculation> calculationList = calculationRepository.findAll();
        assertThat(calculationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCalculations() throws Exception {
        // Initialize the database
        calculationRepository.saveAndFlush(calculation);

        // Get all the calculationList
        restCalculationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(calculation.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].last").value(hasItem(sameInstant(DEFAULT_LAST))))
            .andExpect(jsonPath("$.[*].disabled").value(hasItem(DEFAULT_DISABLED.booleanValue())));
    }

    @Test
    @Transactional
    void getCalculation() throws Exception {
        // Initialize the database
        calculationRepository.saveAndFlush(calculation);

        // Get the calculation
        restCalculationMockMvc
            .perform(get(ENTITY_API_URL_ID, calculation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(calculation.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.last").value(sameInstant(DEFAULT_LAST)))
            .andExpect(jsonPath("$.disabled").value(DEFAULT_DISABLED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingCalculation() throws Exception {
        // Get the calculation
        restCalculationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCalculation() throws Exception {
        // Initialize the database
        calculationRepository.saveAndFlush(calculation);

        int databaseSizeBeforeUpdate = calculationRepository.findAll().size();

        // Update the calculation
        Calculation updatedCalculation = calculationRepository.findById(calculation.getId()).get();
        // Disconnect from session so that the updates on updatedCalculation are not directly saved in db
        em.detach(updatedCalculation);
        updatedCalculation.name(UPDATED_NAME).last(UPDATED_LAST).disabled(UPDATED_DISABLED);

        restCalculationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCalculation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCalculation))
            )
            .andExpect(status().isOk());

        // Validate the Calculation in the database
        List<Calculation> calculationList = calculationRepository.findAll();
        assertThat(calculationList).hasSize(databaseSizeBeforeUpdate);
        Calculation testCalculation = calculationList.get(calculationList.size() - 1);
        assertThat(testCalculation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCalculation.getLast()).isEqualTo(UPDATED_LAST);
        assertThat(testCalculation.getDisabled()).isEqualTo(UPDATED_DISABLED);
    }

    @Test
    @Transactional
    void putNonExistingCalculation() throws Exception {
        int databaseSizeBeforeUpdate = calculationRepository.findAll().size();
        calculation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCalculationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, calculation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(calculation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Calculation in the database
        List<Calculation> calculationList = calculationRepository.findAll();
        assertThat(calculationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCalculation() throws Exception {
        int databaseSizeBeforeUpdate = calculationRepository.findAll().size();
        calculation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCalculationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(calculation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Calculation in the database
        List<Calculation> calculationList = calculationRepository.findAll();
        assertThat(calculationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCalculation() throws Exception {
        int databaseSizeBeforeUpdate = calculationRepository.findAll().size();
        calculation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCalculationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(calculation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Calculation in the database
        List<Calculation> calculationList = calculationRepository.findAll();
        assertThat(calculationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCalculationWithPatch() throws Exception {
        // Initialize the database
        calculationRepository.saveAndFlush(calculation);

        int databaseSizeBeforeUpdate = calculationRepository.findAll().size();

        // Update the calculation using partial update
        Calculation partialUpdatedCalculation = new Calculation();
        partialUpdatedCalculation.setId(calculation.getId());

        partialUpdatedCalculation.name(UPDATED_NAME).last(UPDATED_LAST);

        restCalculationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCalculation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCalculation))
            )
            .andExpect(status().isOk());

        // Validate the Calculation in the database
        List<Calculation> calculationList = calculationRepository.findAll();
        assertThat(calculationList).hasSize(databaseSizeBeforeUpdate);
        Calculation testCalculation = calculationList.get(calculationList.size() - 1);
        assertThat(testCalculation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCalculation.getLast()).isEqualTo(UPDATED_LAST);
        assertThat(testCalculation.getDisabled()).isEqualTo(DEFAULT_DISABLED);
    }

    @Test
    @Transactional
    void fullUpdateCalculationWithPatch() throws Exception {
        // Initialize the database
        calculationRepository.saveAndFlush(calculation);

        int databaseSizeBeforeUpdate = calculationRepository.findAll().size();

        // Update the calculation using partial update
        Calculation partialUpdatedCalculation = new Calculation();
        partialUpdatedCalculation.setId(calculation.getId());

        partialUpdatedCalculation.name(UPDATED_NAME).last(UPDATED_LAST).disabled(UPDATED_DISABLED);

        restCalculationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCalculation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCalculation))
            )
            .andExpect(status().isOk());

        // Validate the Calculation in the database
        List<Calculation> calculationList = calculationRepository.findAll();
        assertThat(calculationList).hasSize(databaseSizeBeforeUpdate);
        Calculation testCalculation = calculationList.get(calculationList.size() - 1);
        assertThat(testCalculation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCalculation.getLast()).isEqualTo(UPDATED_LAST);
        assertThat(testCalculation.getDisabled()).isEqualTo(UPDATED_DISABLED);
    }

    @Test
    @Transactional
    void patchNonExistingCalculation() throws Exception {
        int databaseSizeBeforeUpdate = calculationRepository.findAll().size();
        calculation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCalculationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, calculation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(calculation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Calculation in the database
        List<Calculation> calculationList = calculationRepository.findAll();
        assertThat(calculationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCalculation() throws Exception {
        int databaseSizeBeforeUpdate = calculationRepository.findAll().size();
        calculation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCalculationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(calculation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Calculation in the database
        List<Calculation> calculationList = calculationRepository.findAll();
        assertThat(calculationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCalculation() throws Exception {
        int databaseSizeBeforeUpdate = calculationRepository.findAll().size();
        calculation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCalculationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(calculation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Calculation in the database
        List<Calculation> calculationList = calculationRepository.findAll();
        assertThat(calculationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCalculation() throws Exception {
        // Initialize the database
        calculationRepository.saveAndFlush(calculation);

        int databaseSizeBeforeDelete = calculationRepository.findAll().size();

        // Delete the calculation
        restCalculationMockMvc
            .perform(delete(ENTITY_API_URL_ID, calculation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Calculation> calculationList = calculationRepository.findAll();
        assertThat(calculationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
