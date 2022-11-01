package de.bitc.se.web.rest;

import static de.bitc.se.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import de.bitc.se.IntegrationTest;
import de.bitc.se.domain.Chart;
import de.bitc.se.domain.Pair;
import de.bitc.se.domain.TimeRange;
import de.bitc.se.repository.ChartRepository;
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
 * Integration tests for the {@link ChartResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChartResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_LAST = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAST = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Integer DEFAULT_MAX_COUNT = 1;
    private static final Integer UPDATED_MAX_COUNT = 2;

    private static final Boolean DEFAULT_DISABLED = false;
    private static final Boolean UPDATED_DISABLED = true;

    private static final String ENTITY_API_URL = "/api/charts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChartRepository chartRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChartMockMvc;

    private Chart chart;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chart createEntity(EntityManager em) {
        Chart chart = new Chart().name(DEFAULT_NAME).last(DEFAULT_LAST).maxCount(DEFAULT_MAX_COUNT).disabled(DEFAULT_DISABLED);
        // Add required entity
        Pair pair;
        if (TestUtil.findAll(em, Pair.class).isEmpty()) {
            pair = PairResourceIT.createEntity(em);
            em.persist(pair);
            em.flush();
        } else {
            pair = TestUtil.findAll(em, Pair.class).get(0);
        }
        chart.setPair(pair);
        // Add required entity
        TimeRange timeRange;
        if (TestUtil.findAll(em, TimeRange.class).isEmpty()) {
            timeRange = TimeRangeResourceIT.createEntity(em);
            em.persist(timeRange);
            em.flush();
        } else {
            timeRange = TestUtil.findAll(em, TimeRange.class).get(0);
        }
        chart.setTimeRange(timeRange);
        return chart;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chart createUpdatedEntity(EntityManager em) {
        Chart chart = new Chart().name(UPDATED_NAME).last(UPDATED_LAST).maxCount(UPDATED_MAX_COUNT).disabled(UPDATED_DISABLED);
        // Add required entity
        Pair pair;
        if (TestUtil.findAll(em, Pair.class).isEmpty()) {
            pair = PairResourceIT.createUpdatedEntity(em);
            em.persist(pair);
            em.flush();
        } else {
            pair = TestUtil.findAll(em, Pair.class).get(0);
        }
        chart.setPair(pair);
        // Add required entity
        TimeRange timeRange;
        if (TestUtil.findAll(em, TimeRange.class).isEmpty()) {
            timeRange = TimeRangeResourceIT.createUpdatedEntity(em);
            em.persist(timeRange);
            em.flush();
        } else {
            timeRange = TestUtil.findAll(em, TimeRange.class).get(0);
        }
        chart.setTimeRange(timeRange);
        return chart;
    }

    @BeforeEach
    public void initTest() {
        chart = createEntity(em);
    }

    @Test
    @Transactional
    void createChart() throws Exception {
        int databaseSizeBeforeCreate = chartRepository.findAll().size();
        // Create the Chart
        restChartMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chart)))
            .andExpect(status().isCreated());

        // Validate the Chart in the database
        List<Chart> chartList = chartRepository.findAll();
        assertThat(chartList).hasSize(databaseSizeBeforeCreate + 1);
        Chart testChart = chartList.get(chartList.size() - 1);
        assertThat(testChart.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testChart.getLast()).isEqualTo(DEFAULT_LAST);
        assertThat(testChart.getMaxCount()).isEqualTo(DEFAULT_MAX_COUNT);
        assertThat(testChart.getDisabled()).isEqualTo(DEFAULT_DISABLED);
    }

    @Test
    @Transactional
    void createChartWithExistingId() throws Exception {
        // Create the Chart with an existing ID
        chart.setId(1L);

        int databaseSizeBeforeCreate = chartRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChartMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chart)))
            .andExpect(status().isBadRequest());

        // Validate the Chart in the database
        List<Chart> chartList = chartRepository.findAll();
        assertThat(chartList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCharts() throws Exception {
        // Initialize the database
        chartRepository.saveAndFlush(chart);

        // Get all the chartList
        restChartMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chart.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].last").value(hasItem(sameInstant(DEFAULT_LAST))))
            .andExpect(jsonPath("$.[*].maxCount").value(hasItem(DEFAULT_MAX_COUNT)))
            .andExpect(jsonPath("$.[*].disabled").value(hasItem(DEFAULT_DISABLED.booleanValue())));
    }

    @Test
    @Transactional
    void getChart() throws Exception {
        // Initialize the database
        chartRepository.saveAndFlush(chart);

        // Get the chart
        restChartMockMvc
            .perform(get(ENTITY_API_URL_ID, chart.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chart.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.last").value(sameInstant(DEFAULT_LAST)))
            .andExpect(jsonPath("$.maxCount").value(DEFAULT_MAX_COUNT))
            .andExpect(jsonPath("$.disabled").value(DEFAULT_DISABLED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingChart() throws Exception {
        // Get the chart
        restChartMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingChart() throws Exception {
        // Initialize the database
        chartRepository.saveAndFlush(chart);

        int databaseSizeBeforeUpdate = chartRepository.findAll().size();

        // Update the chart
        Chart updatedChart = chartRepository.findById(chart.getId()).get();
        // Disconnect from session so that the updates on updatedChart are not directly saved in db
        em.detach(updatedChart);
        updatedChart.name(UPDATED_NAME).last(UPDATED_LAST).maxCount(UPDATED_MAX_COUNT).disabled(UPDATED_DISABLED);

        restChartMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChart.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChart))
            )
            .andExpect(status().isOk());

        // Validate the Chart in the database
        List<Chart> chartList = chartRepository.findAll();
        assertThat(chartList).hasSize(databaseSizeBeforeUpdate);
        Chart testChart = chartList.get(chartList.size() - 1);
        assertThat(testChart.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testChart.getLast()).isEqualTo(UPDATED_LAST);
        assertThat(testChart.getMaxCount()).isEqualTo(UPDATED_MAX_COUNT);
        assertThat(testChart.getDisabled()).isEqualTo(UPDATED_DISABLED);
    }

    @Test
    @Transactional
    void putNonExistingChart() throws Exception {
        int databaseSizeBeforeUpdate = chartRepository.findAll().size();
        chart.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChartMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chart.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chart))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chart in the database
        List<Chart> chartList = chartRepository.findAll();
        assertThat(chartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChart() throws Exception {
        int databaseSizeBeforeUpdate = chartRepository.findAll().size();
        chart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChartMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chart))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chart in the database
        List<Chart> chartList = chartRepository.findAll();
        assertThat(chartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChart() throws Exception {
        int databaseSizeBeforeUpdate = chartRepository.findAll().size();
        chart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChartMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chart)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chart in the database
        List<Chart> chartList = chartRepository.findAll();
        assertThat(chartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChartWithPatch() throws Exception {
        // Initialize the database
        chartRepository.saveAndFlush(chart);

        int databaseSizeBeforeUpdate = chartRepository.findAll().size();

        // Update the chart using partial update
        Chart partialUpdatedChart = new Chart();
        partialUpdatedChart.setId(chart.getId());

        partialUpdatedChart.disabled(UPDATED_DISABLED);

        restChartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChart.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChart))
            )
            .andExpect(status().isOk());

        // Validate the Chart in the database
        List<Chart> chartList = chartRepository.findAll();
        assertThat(chartList).hasSize(databaseSizeBeforeUpdate);
        Chart testChart = chartList.get(chartList.size() - 1);
        assertThat(testChart.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testChart.getLast()).isEqualTo(DEFAULT_LAST);
        assertThat(testChart.getMaxCount()).isEqualTo(DEFAULT_MAX_COUNT);
        assertThat(testChart.getDisabled()).isEqualTo(UPDATED_DISABLED);
    }

    @Test
    @Transactional
    void fullUpdateChartWithPatch() throws Exception {
        // Initialize the database
        chartRepository.saveAndFlush(chart);

        int databaseSizeBeforeUpdate = chartRepository.findAll().size();

        // Update the chart using partial update
        Chart partialUpdatedChart = new Chart();
        partialUpdatedChart.setId(chart.getId());

        partialUpdatedChart.name(UPDATED_NAME).last(UPDATED_LAST).maxCount(UPDATED_MAX_COUNT).disabled(UPDATED_DISABLED);

        restChartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChart.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChart))
            )
            .andExpect(status().isOk());

        // Validate the Chart in the database
        List<Chart> chartList = chartRepository.findAll();
        assertThat(chartList).hasSize(databaseSizeBeforeUpdate);
        Chart testChart = chartList.get(chartList.size() - 1);
        assertThat(testChart.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testChart.getLast()).isEqualTo(UPDATED_LAST);
        assertThat(testChart.getMaxCount()).isEqualTo(UPDATED_MAX_COUNT);
        assertThat(testChart.getDisabled()).isEqualTo(UPDATED_DISABLED);
    }

    @Test
    @Transactional
    void patchNonExistingChart() throws Exception {
        int databaseSizeBeforeUpdate = chartRepository.findAll().size();
        chart.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chart.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chart))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chart in the database
        List<Chart> chartList = chartRepository.findAll();
        assertThat(chartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChart() throws Exception {
        int databaseSizeBeforeUpdate = chartRepository.findAll().size();
        chart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chart))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chart in the database
        List<Chart> chartList = chartRepository.findAll();
        assertThat(chartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChart() throws Exception {
        int databaseSizeBeforeUpdate = chartRepository.findAll().size();
        chart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChartMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(chart)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chart in the database
        List<Chart> chartList = chartRepository.findAll();
        assertThat(chartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChart() throws Exception {
        // Initialize the database
        chartRepository.saveAndFlush(chart);

        int databaseSizeBeforeDelete = chartRepository.findAll().size();

        // Delete the chart
        restChartMockMvc
            .perform(delete(ENTITY_API_URL_ID, chart.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Chart> chartList = chartRepository.findAll();
        assertThat(chartList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
