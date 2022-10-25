package de.bitc.se.web.rest;

import de.bitc.se.domain.Fee;
import de.bitc.se.repository.FeeRepository;
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
 * REST controller for managing {@link de.bitc.se.domain.Fee}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FeeResource {

    private final Logger log = LoggerFactory.getLogger(FeeResource.class);

    private static final String ENTITY_NAME = "fee";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FeeRepository feeRepository;

    public FeeResource(FeeRepository feeRepository) {
        this.feeRepository = feeRepository;
    }

    /**
     * {@code POST  /fees} : Create a new fee.
     *
     * @param fee the fee to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fee, or with status {@code 400 (Bad Request)} if the fee has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fees")
    public ResponseEntity<Fee> createFee(@RequestBody Fee fee) throws URISyntaxException {
        log.debug("REST request to save Fee : {}", fee);
        if (fee.getId() != null) {
            throw new BadRequestAlertException("A new fee cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Fee result = feeRepository.save(fee);
        return ResponseEntity
            .created(new URI("/api/fees/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fees/:id} : Updates an existing fee.
     *
     * @param id the id of the fee to save.
     * @param fee the fee to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fee,
     * or with status {@code 400 (Bad Request)} if the fee is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fee couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fees/{id}")
    public ResponseEntity<Fee> updateFee(@PathVariable(value = "id", required = false) final Long id, @RequestBody Fee fee)
        throws URISyntaxException {
        log.debug("REST request to update Fee : {}, {}", id, fee);
        if (fee.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fee.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!feeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Fee result = feeRepository.save(fee);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fee.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fees/:id} : Partial updates given fields of an existing fee, field will ignore if it is null
     *
     * @param id the id of the fee to save.
     * @param fee the fee to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fee,
     * or with status {@code 400 (Bad Request)} if the fee is not valid,
     * or with status {@code 404 (Not Found)} if the fee is not found,
     * or with status {@code 500 (Internal Server Error)} if the fee couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fees/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Fee> partialUpdateFee(@PathVariable(value = "id", required = false) final Long id, @RequestBody Fee fee)
        throws URISyntaxException {
        log.debug("REST request to partial update Fee partially : {}, {}", id, fee);
        if (fee.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fee.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!feeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Fee> result = feeRepository
            .findById(fee.getId())
            .map(existingFee -> {
                if (fee.getVolume() != null) {
                    existingFee.setVolume(fee.getVolume());
                }
                if (fee.getPercent() != null) {
                    existingFee.setPercent(fee.getPercent());
                }

                return existingFee;
            })
            .map(feeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fee.getId().toString())
        );
    }

    /**
     * {@code GET  /fees} : get all the fees.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fees in body.
     */
    @GetMapping("/fees")
    public List<Fee> getAllFees() {
        log.debug("REST request to get all Fees");
        return feeRepository.findAll();
    }

    /**
     * {@code GET  /fees/:id} : get the "id" fee.
     *
     * @param id the id of the fee to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fee, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fees/{id}")
    public ResponseEntity<Fee> getFee(@PathVariable Long id) {
        log.debug("REST request to get Fee : {}", id);
        Optional<Fee> fee = feeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(fee);
    }

    /**
     * {@code DELETE  /fees/:id} : delete the "id" fee.
     *
     * @param id the id of the fee to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fees/{id}")
    public ResponseEntity<Void> deleteFee(@PathVariable Long id) {
        log.debug("REST request to delete Fee : {}", id);
        feeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
