package de.bitc.se.web.rest;

import de.bitc.se.domain.Calculation;
import de.bitc.se.repository.CalculationRepository;
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
 * REST controller for managing {@link de.bitc.se.domain.Calculation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CalculationResource {

    private final Logger log = LoggerFactory.getLogger(CalculationResource.class);

    private static final String ENTITY_NAME = "calculation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CalculationRepository calculationRepository;

    public CalculationResource(CalculationRepository calculationRepository) {
        this.calculationRepository = calculationRepository;
    }

    /**
     * {@code POST  /calculations} : Create a new calculation.
     *
     * @param calculation the calculation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new calculation, or with status {@code 400 (Bad Request)} if the calculation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/calculations")
    public ResponseEntity<Calculation> createCalculation(@Valid @RequestBody Calculation calculation) throws URISyntaxException {
        log.debug("REST request to save Calculation : {}", calculation);
        if (calculation.getId() != null) {
            throw new BadRequestAlertException("A new calculation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Calculation result = calculationRepository.save(calculation);
        return ResponseEntity
            .created(new URI("/api/calculations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /calculations/:id} : Updates an existing calculation.
     *
     * @param id the id of the calculation to save.
     * @param calculation the calculation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated calculation,
     * or with status {@code 400 (Bad Request)} if the calculation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the calculation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/calculations/{id}")
    public ResponseEntity<Calculation> updateCalculation(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Calculation calculation
    ) throws URISyntaxException {
        log.debug("REST request to update Calculation : {}, {}", id, calculation);
        if (calculation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, calculation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!calculationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Calculation result = calculationRepository.save(calculation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, calculation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /calculations/:id} : Partial updates given fields of an existing calculation, field will ignore if it is null
     *
     * @param id the id of the calculation to save.
     * @param calculation the calculation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated calculation,
     * or with status {@code 400 (Bad Request)} if the calculation is not valid,
     * or with status {@code 404 (Not Found)} if the calculation is not found,
     * or with status {@code 500 (Internal Server Error)} if the calculation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/calculations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Calculation> partialUpdateCalculation(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Calculation calculation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Calculation partially : {}, {}", id, calculation);
        if (calculation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, calculation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!calculationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Calculation> result = calculationRepository
            .findById(calculation.getId())
            .map(existingCalculation -> {
                if (calculation.getName() != null) {
                    existingCalculation.setName(calculation.getName());
                }
                if (calculation.getLast() != null) {
                    existingCalculation.setLast(calculation.getLast());
                }
                if (calculation.getDisabled() != null) {
                    existingCalculation.setDisabled(calculation.getDisabled());
                }

                return existingCalculation;
            })
            .map(calculationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, calculation.getId().toString())
        );
    }

    /**
     * {@code GET  /calculations} : get all the calculations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of calculations in body.
     */
    @GetMapping("/calculations")
    public List<Calculation> getAllCalculations() {
        log.debug("REST request to get all Calculations");
        return calculationRepository.findAll();
    }

    /**
     * {@code GET  /calculations/:id} : get the "id" calculation.
     *
     * @param id the id of the calculation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the calculation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/calculations/{id}")
    public ResponseEntity<Calculation> getCalculation(@PathVariable Long id) {
        log.debug("REST request to get Calculation : {}", id);
        Optional<Calculation> calculation = calculationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(calculation);
    }

    /**
     * {@code DELETE  /calculations/:id} : delete the "id" calculation.
     *
     * @param id the id of the calculation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/calculations/{id}")
    public ResponseEntity<Void> deleteCalculation(@PathVariable Long id) {
        log.debug("REST request to delete Calculation : {}", id);
        calculationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
