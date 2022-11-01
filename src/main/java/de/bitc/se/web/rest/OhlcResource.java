package de.bitc.se.web.rest;

import de.bitc.se.domain.Ohlc;
import de.bitc.se.repository.OhlcRepository;
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
 * REST controller for managing {@link de.bitc.se.domain.Ohlc}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OhlcResource {

    private final Logger log = LoggerFactory.getLogger(OhlcResource.class);

    private static final String ENTITY_NAME = "ohlc";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OhlcRepository ohlcRepository;

    public OhlcResource(OhlcRepository ohlcRepository) {
        this.ohlcRepository = ohlcRepository;
    }

    /**
     * {@code POST  /ohlcs} : Create a new ohlc.
     *
     * @param ohlc the ohlc to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ohlc, or with status {@code 400 (Bad Request)} if the ohlc has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ohlcs")
    public ResponseEntity<Ohlc> createOhlc(@Valid @RequestBody Ohlc ohlc) throws URISyntaxException {
        log.debug("REST request to save Ohlc : {}", ohlc);
        if (ohlc.getId() != null) {
            throw new BadRequestAlertException("A new ohlc cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ohlc result = ohlcRepository.save(ohlc);
        return ResponseEntity
            .created(new URI("/api/ohlcs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ohlcs/:id} : Updates an existing ohlc.
     *
     * @param id the id of the ohlc to save.
     * @param ohlc the ohlc to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ohlc,
     * or with status {@code 400 (Bad Request)} if the ohlc is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ohlc couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ohlcs/{id}")
    public ResponseEntity<Ohlc> updateOhlc(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Ohlc ohlc)
        throws URISyntaxException {
        log.debug("REST request to update Ohlc : {}, {}", id, ohlc);
        if (ohlc.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ohlc.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ohlcRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Ohlc result = ohlcRepository.save(ohlc);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ohlc.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ohlcs/:id} : Partial updates given fields of an existing ohlc, field will ignore if it is null
     *
     * @param id the id of the ohlc to save.
     * @param ohlc the ohlc to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ohlc,
     * or with status {@code 400 (Bad Request)} if the ohlc is not valid,
     * or with status {@code 404 (Not Found)} if the ohlc is not found,
     * or with status {@code 500 (Internal Server Error)} if the ohlc couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ohlcs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Ohlc> partialUpdateOhlc(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Ohlc ohlc
    ) throws URISyntaxException {
        log.debug("REST request to partial update Ohlc partially : {}, {}", id, ohlc);
        if (ohlc.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ohlc.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ohlcRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ohlc> result = ohlcRepository
            .findById(ohlc.getId())
            .map(existingOhlc -> {
                if (ohlc.getTime() != null) {
                    existingOhlc.setTime(ohlc.getTime());
                }
                if (ohlc.getOpen() != null) {
                    existingOhlc.setOpen(ohlc.getOpen());
                }
                if (ohlc.getHigh() != null) {
                    existingOhlc.setHigh(ohlc.getHigh());
                }
                if (ohlc.getLow() != null) {
                    existingOhlc.setLow(ohlc.getLow());
                }
                if (ohlc.getClose() != null) {
                    existingOhlc.setClose(ohlc.getClose());
                }
                if (ohlc.getVolumeWeightedAveragePrice() != null) {
                    existingOhlc.setVolumeWeightedAveragePrice(ohlc.getVolumeWeightedAveragePrice());
                }
                if (ohlc.getVolume() != null) {
                    existingOhlc.setVolume(ohlc.getVolume());
                }
                if (ohlc.getCount() != null) {
                    existingOhlc.setCount(ohlc.getCount());
                }

                return existingOhlc;
            })
            .map(ohlcRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ohlc.getId().toString())
        );
    }

    /**
     * {@code GET  /ohlcs} : get all the ohlcs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ohlcs in body.
     */
    @GetMapping("/ohlcs")
    public List<Ohlc> getAllOhlcs() {
        log.debug("REST request to get all Ohlcs");
        return ohlcRepository.findAll();
    }

    /**
     * {@code GET  /ohlcs/:id} : get the "id" ohlc.
     *
     * @param id the id of the ohlc to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ohlc, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ohlcs/{id}")
    public ResponseEntity<Ohlc> getOhlc(@PathVariable Long id) {
        log.debug("REST request to get Ohlc : {}", id);
        Optional<Ohlc> ohlc = ohlcRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(ohlc);
    }

    /**
     * {@code DELETE  /ohlcs/:id} : delete the "id" ohlc.
     *
     * @param id the id of the ohlc to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ohlcs/{id}")
    public ResponseEntity<Void> deleteOhlc(@PathVariable Long id) {
        log.debug("REST request to delete Ohlc : {}", id);
        ohlcRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
