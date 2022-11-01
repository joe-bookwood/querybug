package de.bitc.se.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import de.bitc.se.IntegrationTest;
import de.bitc.se.domain.TimeRange;
import de.bitc.se.repository.TimeRangeRepository;
import java.time.Duration;
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
 * Integration tests for the {@link TimeRangeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TimeRangeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_RANGE_SIZE = 1;
    private static final Integer UPDATED_RANGE_SIZE = 2;

    private static final Duration DEFAULT_DURATION = Duration.ofHours(6);
    private static final Duration UPDATED_DURATION = Duration.ofHours(12);

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/time-ranges";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TimeRangeRepository timeRangeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTimeRangeMockMvc;

    private TimeRange timeRange;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TimeRange createEntity(EntityManager em) {
        TimeRange timeRange = new TimeRange()
            .name(DEFAULT_NAME)
            .rangeSize(DEFAULT_RANGE_SIZE)
            .duration(DEFAULT_DURATION)
            .description(DEFAULT_DESCRIPTION);
        return timeRange;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TimeRange createUpdatedEntity(EntityManager em) {
        TimeRange timeRange = new TimeRange()
            .name(UPDATED_NAME)
            .rangeSize(UPDATED_RANGE_SIZE)
            .duration(UPDATED_DURATION)
            .description(UPDATED_DESCRIPTION);
        return timeRange;
    }

    @BeforeEach
    public void initTest() {
        timeRange = createEntity(em);
    }

    @Test
    @Transactional
    void createTimeRange() throws Exception {
        int databaseSizeBeforeCreate = timeRangeRepository.findAll().size();
        // Create the TimeRange
        restTimeRangeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timeRange)))
            .andExpect(status().isCreated());

        // Validate the TimeRange in the database
        List<TimeRange> timeRangeList = timeRangeRepository.findAll();
        assertThat(timeRangeList).hasSize(databaseSizeBeforeCreate + 1);
        TimeRange testTimeRange = timeRangeList.get(timeRangeList.size() - 1);
        assertThat(testTimeRange.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTimeRange.getRangeSize()).isEqualTo(DEFAULT_RANGE_SIZE);
        assertThat(testTimeRange.getDuration()).isEqualTo(DEFAULT_DURATION);
        assertThat(testTimeRange.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createTimeRangeWithExistingId() throws Exception {
        // Create the TimeRange with an existing ID
        timeRange.setId(1L);

        int databaseSizeBeforeCreate = timeRangeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTimeRangeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timeRange)))
            .andExpect(status().isBadRequest());

        // Validate the TimeRange in the database
        List<TimeRange> timeRangeList = timeRangeRepository.findAll();
        assertThat(timeRangeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTimeRanges() throws Exception {
        // Initialize the database
        timeRangeRepository.saveAndFlush(timeRange);

        // Get all the timeRangeList
        restTimeRangeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(timeRange.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].rangeSize").value(hasItem(DEFAULT_RANGE_SIZE)))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getTimeRange() throws Exception {
        // Initialize the database
        timeRangeRepository.saveAndFlush(timeRange);

        // Get the timeRange
        restTimeRangeMockMvc
            .perform(get(ENTITY_API_URL_ID, timeRange.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(timeRange.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.rangeSize").value(DEFAULT_RANGE_SIZE))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingTimeRange() throws Exception {
        // Get the timeRange
        restTimeRangeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTimeRange() throws Exception {
        // Initialize the database
        timeRangeRepository.saveAndFlush(timeRange);

        int databaseSizeBeforeUpdate = timeRangeRepository.findAll().size();

        // Update the timeRange
        TimeRange updatedTimeRange = timeRangeRepository.findById(timeRange.getId()).get();
        // Disconnect from session so that the updates on updatedTimeRange are not directly saved in db
        em.detach(updatedTimeRange);
        updatedTimeRange.name(UPDATED_NAME).rangeSize(UPDATED_RANGE_SIZE).duration(UPDATED_DURATION).description(UPDATED_DESCRIPTION);

        restTimeRangeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTimeRange.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTimeRange))
            )
            .andExpect(status().isOk());

        // Validate the TimeRange in the database
        List<TimeRange> timeRangeList = timeRangeRepository.findAll();
        assertThat(timeRangeList).hasSize(databaseSizeBeforeUpdate);
        TimeRange testTimeRange = timeRangeList.get(timeRangeList.size() - 1);
        assertThat(testTimeRange.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTimeRange.getRangeSize()).isEqualTo(UPDATED_RANGE_SIZE);
        assertThat(testTimeRange.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testTimeRange.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingTimeRange() throws Exception {
        int databaseSizeBeforeUpdate = timeRangeRepository.findAll().size();
        timeRange.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimeRangeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, timeRange.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timeRange))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimeRange in the database
        List<TimeRange> timeRangeList = timeRangeRepository.findAll();
        assertThat(timeRangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTimeRange() throws Exception {
        int databaseSizeBeforeUpdate = timeRangeRepository.findAll().size();
        timeRange.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeRangeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timeRange))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimeRange in the database
        List<TimeRange> timeRangeList = timeRangeRepository.findAll();
        assertThat(timeRangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTimeRange() throws Exception {
        int databaseSizeBeforeUpdate = timeRangeRepository.findAll().size();
        timeRange.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeRangeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timeRange)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TimeRange in the database
        List<TimeRange> timeRangeList = timeRangeRepository.findAll();
        assertThat(timeRangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTimeRangeWithPatch() throws Exception {
        // Initialize the database
        timeRangeRepository.saveAndFlush(timeRange);

        int databaseSizeBeforeUpdate = timeRangeRepository.findAll().size();

        // Update the timeRange using partial update
        TimeRange partialUpdatedTimeRange = new TimeRange();
        partialUpdatedTimeRange.setId(timeRange.getId());

        partialUpdatedTimeRange.rangeSize(UPDATED_RANGE_SIZE);

        restTimeRangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimeRange.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTimeRange))
            )
            .andExpect(status().isOk());

        // Validate the TimeRange in the database
        List<TimeRange> timeRangeList = timeRangeRepository.findAll();
        assertThat(timeRangeList).hasSize(databaseSizeBeforeUpdate);
        TimeRange testTimeRange = timeRangeList.get(timeRangeList.size() - 1);
        assertThat(testTimeRange.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTimeRange.getRangeSize()).isEqualTo(UPDATED_RANGE_SIZE);
        assertThat(testTimeRange.getDuration()).isEqualTo(DEFAULT_DURATION);
        assertThat(testTimeRange.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateTimeRangeWithPatch() throws Exception {
        // Initialize the database
        timeRangeRepository.saveAndFlush(timeRange);

        int databaseSizeBeforeUpdate = timeRangeRepository.findAll().size();

        // Update the timeRange using partial update
        TimeRange partialUpdatedTimeRange = new TimeRange();
        partialUpdatedTimeRange.setId(timeRange.getId());

        partialUpdatedTimeRange
            .name(UPDATED_NAME)
            .rangeSize(UPDATED_RANGE_SIZE)
            .duration(UPDATED_DURATION)
            .description(UPDATED_DESCRIPTION);

        restTimeRangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimeRange.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTimeRange))
            )
            .andExpect(status().isOk());

        // Validate the TimeRange in the database
        List<TimeRange> timeRangeList = timeRangeRepository.findAll();
        assertThat(timeRangeList).hasSize(databaseSizeBeforeUpdate);
        TimeRange testTimeRange = timeRangeList.get(timeRangeList.size() - 1);
        assertThat(testTimeRange.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTimeRange.getRangeSize()).isEqualTo(UPDATED_RANGE_SIZE);
        assertThat(testTimeRange.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testTimeRange.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingTimeRange() throws Exception {
        int databaseSizeBeforeUpdate = timeRangeRepository.findAll().size();
        timeRange.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimeRangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, timeRange.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timeRange))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimeRange in the database
        List<TimeRange> timeRangeList = timeRangeRepository.findAll();
        assertThat(timeRangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTimeRange() throws Exception {
        int databaseSizeBeforeUpdate = timeRangeRepository.findAll().size();
        timeRange.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeRangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timeRange))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimeRange in the database
        List<TimeRange> timeRangeList = timeRangeRepository.findAll();
        assertThat(timeRangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTimeRange() throws Exception {
        int databaseSizeBeforeUpdate = timeRangeRepository.findAll().size();
        timeRange.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeRangeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(timeRange))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TimeRange in the database
        List<TimeRange> timeRangeList = timeRangeRepository.findAll();
        assertThat(timeRangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTimeRange() throws Exception {
        // Initialize the database
        timeRangeRepository.saveAndFlush(timeRange);

        int databaseSizeBeforeDelete = timeRangeRepository.findAll().size();

        // Delete the timeRange
        restTimeRangeMockMvc
            .perform(delete(ENTITY_API_URL_ID, timeRange.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TimeRange> timeRangeList = timeRangeRepository.findAll();
        assertThat(timeRangeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
