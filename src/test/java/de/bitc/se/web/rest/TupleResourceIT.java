package de.bitc.se.web.rest;

import static de.bitc.se.web.rest.TestUtil.sameInstant;
import static de.bitc.se.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import de.bitc.se.IntegrationTest;
import de.bitc.se.domain.Tuple;
import de.bitc.se.repository.TupleRepository;
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
 * Integration tests for the {@link TupleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TupleResourceIT {

    private static final BigDecimal DEFAULT_COMPUTATION = new BigDecimal(1);
    private static final BigDecimal UPDATED_COMPUTATION = new BigDecimal(2);

    private static final ZonedDateTime DEFAULT_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/tuples";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TupleRepository tupleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTupleMockMvc;

    private Tuple tuple;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tuple createEntity(EntityManager em) {
        Tuple tuple = new Tuple().computation(DEFAULT_COMPUTATION).time(DEFAULT_TIME);
        return tuple;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tuple createUpdatedEntity(EntityManager em) {
        Tuple tuple = new Tuple().computation(UPDATED_COMPUTATION).time(UPDATED_TIME);
        return tuple;
    }

    @BeforeEach
    public void initTest() {
        tuple = createEntity(em);
    }

    @Test
    @Transactional
    void createTuple() throws Exception {
        int databaseSizeBeforeCreate = tupleRepository.findAll().size();
        // Create the Tuple
        restTupleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tuple)))
            .andExpect(status().isCreated());

        // Validate the Tuple in the database
        List<Tuple> tupleList = tupleRepository.findAll();
        assertThat(tupleList).hasSize(databaseSizeBeforeCreate + 1);
        Tuple testTuple = tupleList.get(tupleList.size() - 1);
        assertThat(testTuple.getComputation()).isEqualByComparingTo(DEFAULT_COMPUTATION);
        assertThat(testTuple.getTime()).isEqualTo(DEFAULT_TIME);
    }

    @Test
    @Transactional
    void createTupleWithExistingId() throws Exception {
        // Create the Tuple with an existing ID
        tuple.setId(1L);

        int databaseSizeBeforeCreate = tupleRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTupleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tuple)))
            .andExpect(status().isBadRequest());

        // Validate the Tuple in the database
        List<Tuple> tupleList = tupleRepository.findAll();
        assertThat(tupleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTuples() throws Exception {
        // Initialize the database
        tupleRepository.saveAndFlush(tuple);

        // Get all the tupleList
        restTupleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tuple.getId().intValue())))
            .andExpect(jsonPath("$.[*].computation").value(hasItem(sameNumber(DEFAULT_COMPUTATION))))
            .andExpect(jsonPath("$.[*].time").value(hasItem(sameInstant(DEFAULT_TIME))));
    }

    @Test
    @Transactional
    void getTuple() throws Exception {
        // Initialize the database
        tupleRepository.saveAndFlush(tuple);

        // Get the tuple
        restTupleMockMvc
            .perform(get(ENTITY_API_URL_ID, tuple.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tuple.getId().intValue()))
            .andExpect(jsonPath("$.computation").value(sameNumber(DEFAULT_COMPUTATION)))
            .andExpect(jsonPath("$.time").value(sameInstant(DEFAULT_TIME)));
    }

    @Test
    @Transactional
    void getNonExistingTuple() throws Exception {
        // Get the tuple
        restTupleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTuple() throws Exception {
        // Initialize the database
        tupleRepository.saveAndFlush(tuple);

        int databaseSizeBeforeUpdate = tupleRepository.findAll().size();

        // Update the tuple
        Tuple updatedTuple = tupleRepository.findById(tuple.getId()).get();
        // Disconnect from session so that the updates on updatedTuple are not directly saved in db
        em.detach(updatedTuple);
        updatedTuple.computation(UPDATED_COMPUTATION).time(UPDATED_TIME);

        restTupleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTuple.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTuple))
            )
            .andExpect(status().isOk());

        // Validate the Tuple in the database
        List<Tuple> tupleList = tupleRepository.findAll();
        assertThat(tupleList).hasSize(databaseSizeBeforeUpdate);
        Tuple testTuple = tupleList.get(tupleList.size() - 1);
        assertThat(testTuple.getComputation()).isEqualByComparingTo(UPDATED_COMPUTATION);
        assertThat(testTuple.getTime()).isEqualTo(UPDATED_TIME);
    }

    @Test
    @Transactional
    void putNonExistingTuple() throws Exception {
        int databaseSizeBeforeUpdate = tupleRepository.findAll().size();
        tuple.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTupleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tuple.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tuple))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tuple in the database
        List<Tuple> tupleList = tupleRepository.findAll();
        assertThat(tupleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTuple() throws Exception {
        int databaseSizeBeforeUpdate = tupleRepository.findAll().size();
        tuple.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTupleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tuple))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tuple in the database
        List<Tuple> tupleList = tupleRepository.findAll();
        assertThat(tupleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTuple() throws Exception {
        int databaseSizeBeforeUpdate = tupleRepository.findAll().size();
        tuple.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTupleMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tuple)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tuple in the database
        List<Tuple> tupleList = tupleRepository.findAll();
        assertThat(tupleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTupleWithPatch() throws Exception {
        // Initialize the database
        tupleRepository.saveAndFlush(tuple);

        int databaseSizeBeforeUpdate = tupleRepository.findAll().size();

        // Update the tuple using partial update
        Tuple partialUpdatedTuple = new Tuple();
        partialUpdatedTuple.setId(tuple.getId());

        partialUpdatedTuple.computation(UPDATED_COMPUTATION).time(UPDATED_TIME);

        restTupleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTuple.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTuple))
            )
            .andExpect(status().isOk());

        // Validate the Tuple in the database
        List<Tuple> tupleList = tupleRepository.findAll();
        assertThat(tupleList).hasSize(databaseSizeBeforeUpdate);
        Tuple testTuple = tupleList.get(tupleList.size() - 1);
        assertThat(testTuple.getComputation()).isEqualByComparingTo(UPDATED_COMPUTATION);
        assertThat(testTuple.getTime()).isEqualTo(UPDATED_TIME);
    }

    @Test
    @Transactional
    void fullUpdateTupleWithPatch() throws Exception {
        // Initialize the database
        tupleRepository.saveAndFlush(tuple);

        int databaseSizeBeforeUpdate = tupleRepository.findAll().size();

        // Update the tuple using partial update
        Tuple partialUpdatedTuple = new Tuple();
        partialUpdatedTuple.setId(tuple.getId());

        partialUpdatedTuple.computation(UPDATED_COMPUTATION).time(UPDATED_TIME);

        restTupleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTuple.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTuple))
            )
            .andExpect(status().isOk());

        // Validate the Tuple in the database
        List<Tuple> tupleList = tupleRepository.findAll();
        assertThat(tupleList).hasSize(databaseSizeBeforeUpdate);
        Tuple testTuple = tupleList.get(tupleList.size() - 1);
        assertThat(testTuple.getComputation()).isEqualByComparingTo(UPDATED_COMPUTATION);
        assertThat(testTuple.getTime()).isEqualTo(UPDATED_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingTuple() throws Exception {
        int databaseSizeBeforeUpdate = tupleRepository.findAll().size();
        tuple.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTupleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tuple.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tuple))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tuple in the database
        List<Tuple> tupleList = tupleRepository.findAll();
        assertThat(tupleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTuple() throws Exception {
        int databaseSizeBeforeUpdate = tupleRepository.findAll().size();
        tuple.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTupleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tuple))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tuple in the database
        List<Tuple> tupleList = tupleRepository.findAll();
        assertThat(tupleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTuple() throws Exception {
        int databaseSizeBeforeUpdate = tupleRepository.findAll().size();
        tuple.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTupleMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(tuple)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tuple in the database
        List<Tuple> tupleList = tupleRepository.findAll();
        assertThat(tupleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTuple() throws Exception {
        // Initialize the database
        tupleRepository.saveAndFlush(tuple);

        int databaseSizeBeforeDelete = tupleRepository.findAll().size();

        // Delete the tuple
        restTupleMockMvc
            .perform(delete(ENTITY_API_URL_ID, tuple.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Tuple> tupleList = tupleRepository.findAll();
        assertThat(tupleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
