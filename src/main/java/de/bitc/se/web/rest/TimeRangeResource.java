package de.bitc.se.web.rest;

import de.bitc.se.domain.TimeRange;
import de.bitc.se.repository.TimeRangeRepository;
import de.bitc.se.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link de.bitc.se.domain.TimeRange}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TimeRangeResource {

    private final Logger log = LoggerFactory.getLogger(TimeRangeResource.class);

    private static final String ENTITY_NAME = "timeRange";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TimeRangeRepository timeRangeRepository;

    public TimeRangeResource(TimeRangeRepository timeRangeRepository) {
        this.timeRangeRepository = timeRangeRepository;
    }

    /**
     * {@code POST  /time-ranges} : Create a new timeRange.
     *
     * @param timeRange the timeRange to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new timeRange, or with status {@code 400 (Bad Request)} if the timeRange has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/time-ranges")
    public ResponseEntity<TimeRange> createTimeRange(@RequestBody TimeRange timeRange) throws URISyntaxException {
        log.debug("REST request to save TimeRange : {}", timeRange);
        if (timeRange.getId() != null) {
            throw new BadRequestAlertException("A new timeRange cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TimeRange result = timeRangeRepository.save(timeRange);
        return ResponseEntity
            .created(new URI("/api/time-ranges/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /time-ranges/:id} : Updates an existing timeRange.
     *
     * @param id the id of the timeRange to save.
     * @param timeRange the timeRange to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated timeRange,
     * or with status {@code 400 (Bad Request)} if the timeRange is not valid,
     * or with status {@code 500 (Internal Server Error)} if the timeRange couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/time-ranges/{id}")
    public ResponseEntity<TimeRange> updateTimeRange(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TimeRange timeRange
    ) throws URISyntaxException {
        log.debug("REST request to update TimeRange : {}, {}", id, timeRange);
        if (timeRange.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, timeRange.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!timeRangeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TimeRange result = timeRangeRepository.save(timeRange);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, timeRange.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /time-ranges/:id} : Partial updates given fields of an existing timeRange, field will ignore if it is null
     *
     * @param id the id of the timeRange to save.
     * @param timeRange the timeRange to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated timeRange,
     * or with status {@code 400 (Bad Request)} if the timeRange is not valid,
     * or with status {@code 404 (Not Found)} if the timeRange is not found,
     * or with status {@code 500 (Internal Server Error)} if the timeRange couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/time-ranges/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TimeRange> partialUpdateTimeRange(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TimeRange timeRange
    ) throws URISyntaxException {
        log.debug("REST request to partial update TimeRange partially : {}, {}", id, timeRange);
        if (timeRange.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, timeRange.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!timeRangeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TimeRange> result = timeRangeRepository
            .findById(timeRange.getId())
            .map(existingTimeRange -> {
                if (timeRange.getName() != null) {
                    existingTimeRange.setName(timeRange.getName());
                }
                if (timeRange.getRangeSize() != null) {
                    existingTimeRange.setRangeSize(timeRange.getRangeSize());
                }
                if (timeRange.getDuration() != null) {
                    existingTimeRange.setDuration(timeRange.getDuration());
                }
                if (timeRange.getDescription() != null) {
                    existingTimeRange.setDescription(timeRange.getDescription());
                }

                return existingTimeRange;
            })
            .map(timeRangeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, timeRange.getId().toString())
        );
    }

    /**
     * {@code GET  /time-ranges} : get all the timeRanges.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of timeRanges in body.
     */
    @GetMapping("/time-ranges")
    public List<TimeRange> getAllTimeRanges() {
        log.debug("REST request to get all TimeRanges");
        return timeRangeRepository.findAll();
    }

    /**
     * {@code GET  /time-ranges/:id} : get the "id" timeRange.
     *
     * @param id the id of the timeRange to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the timeRange, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/time-ranges/{id}")
    public ResponseEntity<TimeRange> getTimeRange(@PathVariable Long id) {
        log.debug("REST request to get TimeRange : {}", id);
        Optional<TimeRange> timeRange = timeRangeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(timeRange);
    }

    /**
     * {@code DELETE  /time-ranges/:id} : delete the "id" timeRange.
     *
     * @param id the id of the timeRange to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/time-ranges/{id}")
    public ResponseEntity<Void> deleteTimeRange(@PathVariable Long id) {
        log.debug("REST request to delete TimeRange : {}", id);
        timeRangeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
