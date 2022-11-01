package de.bitc.se.web.rest;

import de.bitc.se.domain.Chart;
import de.bitc.se.repository.ChartRepository;
import de.bitc.se.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link de.bitc.se.domain.Chart}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChartResource {

    private final Logger log = LoggerFactory.getLogger(ChartResource.class);

    private static final String ENTITY_NAME = "chart";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChartRepository chartRepository;

    public ChartResource(ChartRepository chartRepository) {
        this.chartRepository = chartRepository;
    }

    /**
     * {@code POST  /charts} : Create a new chart.
     *
     * @param chart the chart to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chart, or with status {@code 400 (Bad Request)} if the chart has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/charts")
    public ResponseEntity<Chart> createChart(@Valid @RequestBody Chart chart) throws URISyntaxException {
        log.debug("REST request to save Chart : {}", chart);
        if (chart.getId() != null) {
            throw new BadRequestAlertException("A new chart cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Chart result = chartRepository.save(chart);
        return ResponseEntity
            .created(new URI("/api/charts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /charts/:id} : Updates an existing chart.
     *
     * @param id the id of the chart to save.
     * @param chart the chart to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chart,
     * or with status {@code 400 (Bad Request)} if the chart is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chart couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/charts/{id}")
    public ResponseEntity<Chart> updateChart(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Chart chart)
        throws URISyntaxException {
        log.debug("REST request to update Chart : {}, {}", id, chart);
        if (chart.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chart.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chartRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Chart result = chartRepository.save(chart);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chart.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /charts/:id} : Partial updates given fields of an existing chart, field will ignore if it is null
     *
     * @param id the id of the chart to save.
     * @param chart the chart to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chart,
     * or with status {@code 400 (Bad Request)} if the chart is not valid,
     * or with status {@code 404 (Not Found)} if the chart is not found,
     * or with status {@code 500 (Internal Server Error)} if the chart couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/charts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Chart> partialUpdateChart(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Chart chart
    ) throws URISyntaxException {
        log.debug("REST request to partial update Chart partially : {}, {}", id, chart);
        if (chart.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chart.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chartRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Chart> result = chartRepository
            .findById(chart.getId())
            .map(existingChart -> {
                if (chart.getName() != null) {
                    existingChart.setName(chart.getName());
                }
                if (chart.getLast() != null) {
                    existingChart.setLast(chart.getLast());
                }
                if (chart.getMaxCount() != null) {
                    existingChart.setMaxCount(chart.getMaxCount());
                }
                if (chart.getDisabled() != null) {
                    existingChart.setDisabled(chart.getDisabled());
                }

                return existingChart;
            })
            .map(chartRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chart.getId().toString())
        );
    }

    /**
     * {@code GET  /charts} : get all the charts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of charts in body.
     */
    @GetMapping("/charts")
    public List<Chart> getAllCharts() {
        log.debug("REST request to get all Charts");
        return chartRepository.findAll();
    }

    /**
     * {@code GET  /charts/:id} : get the "id" chart.
     *
     * @param id the id of the chart to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chart, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/charts/{id}")
    public ResponseEntity<Chart> getChart(@PathVariable Long id) {
        log.debug("REST request to get Chart : {}", id);
        Optional<Chart> chart = chartRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(chart);
    }

    /**
     * {@code DELETE  /charts/:id} : delete the "id" chart.
     *
     * @param id the id of the chart to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/charts/{id}")
    public ResponseEntity<Void> deleteChart(@PathVariable Long id) {
        log.debug("REST request to delete Chart : {}", id);
        chartRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
