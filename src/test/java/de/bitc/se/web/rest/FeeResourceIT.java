package de.bitc.se.web.rest;

import static de.bitc.se.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import de.bitc.se.IntegrationTest;
import de.bitc.se.domain.Fee;
import de.bitc.se.repository.FeeRepository;
import java.math.BigDecimal;
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
 * Integration tests for the {@link FeeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FeeResourceIT {

    private static final Integer DEFAULT_VOLUME = 1;
    private static final Integer UPDATED_VOLUME = 2;

    private static final BigDecimal DEFAULT_PERCENT = new BigDecimal(1);
    private static final BigDecimal UPDATED_PERCENT = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/fees";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FeeRepository feeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFeeMockMvc;

    private Fee fee;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fee createEntity(EntityManager em) {
        Fee fee = new Fee().volume(DEFAULT_VOLUME).percent(DEFAULT_PERCENT);
        return fee;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fee createUpdatedEntity(EntityManager em) {
        Fee fee = new Fee().volume(UPDATED_VOLUME).percent(UPDATED_PERCENT);
        return fee;
    }

    @BeforeEach
    public void initTest() {
        fee = createEntity(em);
    }

    @Test
    @Transactional
    void createFee() throws Exception {
        int databaseSizeBeforeCreate = feeRepository.findAll().size();
        // Create the Fee
        restFeeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fee)))
            .andExpect(status().isCreated());

        // Validate the Fee in the database
        List<Fee> feeList = feeRepository.findAll();
        assertThat(feeList).hasSize(databaseSizeBeforeCreate + 1);
        Fee testFee = feeList.get(feeList.size() - 1);
        assertThat(testFee.getVolume()).isEqualTo(DEFAULT_VOLUME);
        assertThat(testFee.getPercent()).isEqualByComparingTo(DEFAULT_PERCENT);
    }

    @Test
    @Transactional
    void createFeeWithExistingId() throws Exception {
        // Create the Fee with an existing ID
        fee.setId(1L);

        int databaseSizeBeforeCreate = feeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFeeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fee)))
            .andExpect(status().isBadRequest());

        // Validate the Fee in the database
        List<Fee> feeList = feeRepository.findAll();
        assertThat(feeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFees() throws Exception {
        // Initialize the database
        feeRepository.saveAndFlush(fee);

        // Get all the feeList
        restFeeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fee.getId().intValue())))
            .andExpect(jsonPath("$.[*].volume").value(hasItem(DEFAULT_VOLUME)))
            .andExpect(jsonPath("$.[*].percent").value(hasItem(sameNumber(DEFAULT_PERCENT))));
    }

    @Test
    @Transactional
    void getFee() throws Exception {
        // Initialize the database
        feeRepository.saveAndFlush(fee);

        // Get the fee
        restFeeMockMvc
            .perform(get(ENTITY_API_URL_ID, fee.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(fee.getId().intValue()))
            .andExpect(jsonPath("$.volume").value(DEFAULT_VOLUME))
            .andExpect(jsonPath("$.percent").value(sameNumber(DEFAULT_PERCENT)));
    }

    @Test
    @Transactional
    void getNonExistingFee() throws Exception {
        // Get the fee
        restFeeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFee() throws Exception {
        // Initialize the database
        feeRepository.saveAndFlush(fee);

        int databaseSizeBeforeUpdate = feeRepository.findAll().size();

        // Update the fee
        Fee updatedFee = feeRepository.findById(fee.getId()).get();
        // Disconnect from session so that the updates on updatedFee are not directly saved in db
        em.detach(updatedFee);
        updatedFee.volume(UPDATED_VOLUME).percent(UPDATED_PERCENT);

        restFeeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFee.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFee))
            )
            .andExpect(status().isOk());

        // Validate the Fee in the database
        List<Fee> feeList = feeRepository.findAll();
        assertThat(feeList).hasSize(databaseSizeBeforeUpdate);
        Fee testFee = feeList.get(feeList.size() - 1);
        assertThat(testFee.getVolume()).isEqualTo(UPDATED_VOLUME);
        assertThat(testFee.getPercent()).isEqualByComparingTo(UPDATED_PERCENT);
    }

    @Test
    @Transactional
    void putNonExistingFee() throws Exception {
        int databaseSizeBeforeUpdate = feeRepository.findAll().size();
        fee.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFeeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, fee.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fee in the database
        List<Fee> feeList = feeRepository.findAll();
        assertThat(feeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFee() throws Exception {
        int databaseSizeBeforeUpdate = feeRepository.findAll().size();
        fee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fee in the database
        List<Fee> feeList = feeRepository.findAll();
        assertThat(feeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFee() throws Exception {
        int databaseSizeBeforeUpdate = feeRepository.findAll().size();
        fee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fee)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Fee in the database
        List<Fee> feeList = feeRepository.findAll();
        assertThat(feeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFeeWithPatch() throws Exception {
        // Initialize the database
        feeRepository.saveAndFlush(fee);

        int databaseSizeBeforeUpdate = feeRepository.findAll().size();

        // Update the fee using partial update
        Fee partialUpdatedFee = new Fee();
        partialUpdatedFee.setId(fee.getId());

        partialUpdatedFee.percent(UPDATED_PERCENT);

        restFeeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFee.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFee))
            )
            .andExpect(status().isOk());

        // Validate the Fee in the database
        List<Fee> feeList = feeRepository.findAll();
        assertThat(feeList).hasSize(databaseSizeBeforeUpdate);
        Fee testFee = feeList.get(feeList.size() - 1);
        assertThat(testFee.getVolume()).isEqualTo(DEFAULT_VOLUME);
        assertThat(testFee.getPercent()).isEqualByComparingTo(UPDATED_PERCENT);
    }

    @Test
    @Transactional
    void fullUpdateFeeWithPatch() throws Exception {
        // Initialize the database
        feeRepository.saveAndFlush(fee);

        int databaseSizeBeforeUpdate = feeRepository.findAll().size();

        // Update the fee using partial update
        Fee partialUpdatedFee = new Fee();
        partialUpdatedFee.setId(fee.getId());

        partialUpdatedFee.volume(UPDATED_VOLUME).percent(UPDATED_PERCENT);

        restFeeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFee.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFee))
            )
            .andExpect(status().isOk());

        // Validate the Fee in the database
        List<Fee> feeList = feeRepository.findAll();
        assertThat(feeList).hasSize(databaseSizeBeforeUpdate);
        Fee testFee = feeList.get(feeList.size() - 1);
        assertThat(testFee.getVolume()).isEqualTo(UPDATED_VOLUME);
        assertThat(testFee.getPercent()).isEqualByComparingTo(UPDATED_PERCENT);
    }

    @Test
    @Transactional
    void patchNonExistingFee() throws Exception {
        int databaseSizeBeforeUpdate = feeRepository.findAll().size();
        fee.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFeeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, fee.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fee in the database
        List<Fee> feeList = feeRepository.findAll();
        assertThat(feeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFee() throws Exception {
        int databaseSizeBeforeUpdate = feeRepository.findAll().size();
        fee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fee in the database
        List<Fee> feeList = feeRepository.findAll();
        assertThat(feeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFee() throws Exception {
        int databaseSizeBeforeUpdate = feeRepository.findAll().size();
        fee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(fee)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Fee in the database
        List<Fee> feeList = feeRepository.findAll();
        assertThat(feeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFee() throws Exception {
        // Initialize the database
        feeRepository.saveAndFlush(fee);

        int databaseSizeBeforeDelete = feeRepository.findAll().size();

        // Delete the fee
        restFeeMockMvc.perform(delete(ENTITY_API_URL_ID, fee.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Fee> feeList = feeRepository.findAll();
        assertThat(feeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
