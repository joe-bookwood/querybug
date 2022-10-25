package de.bitc.se.web.rest;

import static de.bitc.se.web.rest.TestUtil.sameInstant;
import static de.bitc.se.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import de.bitc.se.IntegrationTest;
import de.bitc.se.domain.Touple;
import de.bitc.se.repository.ToupleRepository;
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
 * Integration tests for the {@link ToupleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ToupleResourceIT {

    private static final BigDecimal DEFAULT_COMPUTATION = new BigDecimal(1);
    private static final BigDecimal UPDATED_COMPUTATION = new BigDecimal(2);

    private static final ZonedDateTime DEFAULT_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/touples";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ToupleRepository toupleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restToupleMockMvc;

    private Touple touple;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Touple createEntity(EntityManager em) {
        Touple touple = new Touple().computation(DEFAULT_COMPUTATION).time(DEFAULT_TIME);
        return touple;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Touple createUpdatedEntity(EntityManager em) {
        Touple touple = new Touple().computation(UPDATED_COMPUTATION).time(UPDATED_TIME);
        return touple;
    }

    @BeforeEach
    public void initTest() {
        touple = createEntity(em);
    }

    @Test
    @Transactional
    void createTouple() throws Exception {
        int databaseSizeBeforeCreate = toupleRepository.findAll().size();
        // Create the Touple
        restToupleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(touple)))
            .andExpect(status().isCreated());

        // Validate the Touple in the database
        List<Touple> toupleList = toupleRepository.findAll();
        assertThat(toupleList).hasSize(databaseSizeBeforeCreate + 1);
        Touple testTouple = toupleList.get(toupleList.size() - 1);
        assertThat(testTouple.getComputation()).isEqualByComparingTo(DEFAULT_COMPUTATION);
        assertThat(testTouple.getTime()).isEqualTo(DEFAULT_TIME);
    }

    @Test
    @Transactional
    void createToupleWithExistingId() throws Exception {
        // Create the Touple with an existing ID
        touple.setId(1L);

        int databaseSizeBeforeCreate = toupleRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restToupleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(touple)))
            .andExpect(status().isBadRequest());

        // Validate the Touple in the database
        List<Touple> toupleList = toupleRepository.findAll();
        assertThat(toupleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTouples() throws Exception {
        // Initialize the database
        toupleRepository.saveAndFlush(touple);

        // Get all the toupleList
        restToupleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(touple.getId().intValue())))
            .andExpect(jsonPath("$.[*].computation").value(hasItem(sameNumber(DEFAULT_COMPUTATION))))
            .andExpect(jsonPath("$.[*].time").value(hasItem(sameInstant(DEFAULT_TIME))));
    }

    @Test
    @Transactional
    void getTouple() throws Exception {
        // Initialize the database
        toupleRepository.saveAndFlush(touple);

        // Get the touple
        restToupleMockMvc
            .perform(get(ENTITY_API_URL_ID, touple.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(touple.getId().intValue()))
            .andExpect(jsonPath("$.computation").value(sameNumber(DEFAULT_COMPUTATION)))
            .andExpect(jsonPath("$.time").value(sameInstant(DEFAULT_TIME)));
    }

    @Test
    @Transactional
    void getNonExistingTouple() throws Exception {
        // Get the touple
        restToupleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTouple() throws Exception {
        // Initialize the database
        toupleRepository.saveAndFlush(touple);

        int databaseSizeBeforeUpdate = toupleRepository.findAll().size();

        // Update the touple
        Touple updatedTouple = toupleRepository.findById(touple.getId()).get();
        // Disconnect from session so that the updates on updatedTouple are not directly saved in db
        em.detach(updatedTouple);
        updatedTouple.computation(UPDATED_COMPUTATION).time(UPDATED_TIME);

        restToupleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTouple.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTouple))
            )
            .andExpect(status().isOk());

        // Validate the Touple in the database
        List<Touple> toupleList = toupleRepository.findAll();
        assertThat(toupleList).hasSize(databaseSizeBeforeUpdate);
        Touple testTouple = toupleList.get(toupleList.size() - 1);
        assertThat(testTouple.getComputation()).isEqualByComparingTo(UPDATED_COMPUTATION);
        assertThat(testTouple.getTime()).isEqualTo(UPDATED_TIME);
    }

    @Test
    @Transactional
    void putNonExistingTouple() throws Exception {
        int databaseSizeBeforeUpdate = toupleRepository.findAll().size();
        touple.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restToupleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, touple.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(touple))
            )
            .andExpect(status().isBadRequest());

        // Validate the Touple in the database
        List<Touple> toupleList = toupleRepository.findAll();
        assertThat(toupleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTouple() throws Exception {
        int databaseSizeBeforeUpdate = toupleRepository.findAll().size();
        touple.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restToupleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(touple))
            )
            .andExpect(status().isBadRequest());

        // Validate the Touple in the database
        List<Touple> toupleList = toupleRepository.findAll();
        assertThat(toupleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTouple() throws Exception {
        int databaseSizeBeforeUpdate = toupleRepository.findAll().size();
        touple.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restToupleMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(touple)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Touple in the database
        List<Touple> toupleList = toupleRepository.findAll();
        assertThat(toupleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateToupleWithPatch() throws Exception {
        // Initialize the database
        toupleRepository.saveAndFlush(touple);

        int databaseSizeBeforeUpdate = toupleRepository.findAll().size();

        // Update the touple using partial update
        Touple partialUpdatedTouple = new Touple();
        partialUpdatedTouple.setId(touple.getId());

        partialUpdatedTouple.computation(UPDATED_COMPUTATION).time(UPDATED_TIME);

        restToupleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTouple.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTouple))
            )
            .andExpect(status().isOk());

        // Validate the Touple in the database
        List<Touple> toupleList = toupleRepository.findAll();
        assertThat(toupleList).hasSize(databaseSizeBeforeUpdate);
        Touple testTouple = toupleList.get(toupleList.size() - 1);
        assertThat(testTouple.getComputation()).isEqualByComparingTo(UPDATED_COMPUTATION);
        assertThat(testTouple.getTime()).isEqualTo(UPDATED_TIME);
    }

    @Test
    @Transactional
    void fullUpdateToupleWithPatch() throws Exception {
        // Initialize the database
        toupleRepository.saveAndFlush(touple);

        int databaseSizeBeforeUpdate = toupleRepository.findAll().size();

        // Update the touple using partial update
        Touple partialUpdatedTouple = new Touple();
        partialUpdatedTouple.setId(touple.getId());

        partialUpdatedTouple.computation(UPDATED_COMPUTATION).time(UPDATED_TIME);

        restToupleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTouple.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTouple))
            )
            .andExpect(status().isOk());

        // Validate the Touple in the database
        List<Touple> toupleList = toupleRepository.findAll();
        assertThat(toupleList).hasSize(databaseSizeBeforeUpdate);
        Touple testTouple = toupleList.get(toupleList.size() - 1);
        assertThat(testTouple.getComputation()).isEqualByComparingTo(UPDATED_COMPUTATION);
        assertThat(testTouple.getTime()).isEqualTo(UPDATED_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingTouple() throws Exception {
        int databaseSizeBeforeUpdate = toupleRepository.findAll().size();
        touple.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restToupleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, touple.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(touple))
            )
            .andExpect(status().isBadRequest());

        // Validate the Touple in the database
        List<Touple> toupleList = toupleRepository.findAll();
        assertThat(toupleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTouple() throws Exception {
        int databaseSizeBeforeUpdate = toupleRepository.findAll().size();
        touple.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restToupleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(touple))
            )
            .andExpect(status().isBadRequest());

        // Validate the Touple in the database
        List<Touple> toupleList = toupleRepository.findAll();
        assertThat(toupleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTouple() throws Exception {
        int databaseSizeBeforeUpdate = toupleRepository.findAll().size();
        touple.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restToupleMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(touple)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Touple in the database
        List<Touple> toupleList = toupleRepository.findAll();
        assertThat(toupleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTouple() throws Exception {
        // Initialize the database
        toupleRepository.saveAndFlush(touple);

        int databaseSizeBeforeDelete = toupleRepository.findAll().size();

        // Delete the touple
        restToupleMockMvc
            .perform(delete(ENTITY_API_URL_ID, touple.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Touple> toupleList = toupleRepository.findAll();
        assertThat(toupleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
