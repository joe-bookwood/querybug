package de.bitc.se.web.rest;

import de.bitc.se.domain.Pair;
import de.bitc.se.repository.PairRepository;
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
 * REST controller for managing {@link de.bitc.se.domain.Pair}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PairResource {

    private final Logger log = LoggerFactory.getLogger(PairResource.class);

    private static final String ENTITY_NAME = "pair";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PairRepository pairRepository;

    public PairResource(PairRepository pairRepository) {
        this.pairRepository = pairRepository;
    }

    /**
     * {@code POST  /pairs} : Create a new pair.
     *
     * @param pair the pair to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pair, or with status {@code 400 (Bad Request)} if the pair has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/pairs")
    public ResponseEntity<Pair> createPair(@Valid @RequestBody Pair pair) throws URISyntaxException {
        log.debug("REST request to save Pair : {}", pair);
        if (pair.getId() != null) {
            throw new BadRequestAlertException("A new pair cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Pair result = pairRepository.save(pair);
        return ResponseEntity
            .created(new URI("/api/pairs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /pairs/:id} : Updates an existing pair.
     *
     * @param id the id of the pair to save.
     * @param pair the pair to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pair,
     * or with status {@code 400 (Bad Request)} if the pair is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pair couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/pairs/{id}")
    public ResponseEntity<Pair> updatePair(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Pair pair)
        throws URISyntaxException {
        log.debug("REST request to update Pair : {}, {}", id, pair);
        if (pair.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pair.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pairRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Pair result = pairRepository.save(pair);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pair.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /pairs/:id} : Partial updates given fields of an existing pair, field will ignore if it is null
     *
     * @param id the id of the pair to save.
     * @param pair the pair to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pair,
     * or with status {@code 400 (Bad Request)} if the pair is not valid,
     * or with status {@code 404 (Not Found)} if the pair is not found,
     * or with status {@code 500 (Internal Server Error)} if the pair couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/pairs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Pair> partialUpdatePair(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Pair pair
    ) throws URISyntaxException {
        log.debug("REST request to partial update Pair partially : {}, {}", id, pair);
        if (pair.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pair.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pairRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Pair> result = pairRepository
            .findById(pair.getId())
            .map(existingPair -> {
                if (pair.getName() != null) {
                    existingPair.setName(pair.getName());
                }
                if (pair.getAltname() != null) {
                    existingPair.setAltname(pair.getAltname());
                }
                if (pair.getWebSocketPairName() != null) {
                    existingPair.setWebSocketPairName(pair.getWebSocketPairName());
                }
                if (pair.getLot() != null) {
                    existingPair.setLot(pair.getLot());
                }
                if (pair.getPairDecimal() != null) {
                    existingPair.setPairDecimal(pair.getPairDecimal());
                }
                if (pair.getLotDecimals() != null) {
                    existingPair.setLotDecimals(pair.getLotDecimals());
                }
                if (pair.getLotMultiplier() != null) {
                    existingPair.setLotMultiplier(pair.getLotMultiplier());
                }

                return existingPair;
            })
            .map(pairRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pair.getId().toString())
        );
    }

    /**
     * {@code GET  /pairs} : get all the pairs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pairs in body.
     */
    @GetMapping("/pairs")
    public List<Pair> getAllPairs() {
        log.debug("REST request to get all Pairs");
        return pairRepository.findAll();
    }

    /**
     * {@code GET  /pairs/:id} : get the "id" pair.
     *
     * @param id the id of the pair to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pair, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pairs/{id}")
    public ResponseEntity<Pair> getPair(@PathVariable Long id) {
        log.debug("REST request to get Pair : {}", id);
        Optional<Pair> pair = pairRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(pair);
    }

    /**
     * {@code DELETE  /pairs/:id} : delete the "id" pair.
     *
     * @param id the id of the pair to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pairs/{id}")
    public ResponseEntity<Void> deletePair(@PathVariable Long id) {
        log.debug("REST request to delete Pair : {}", id);
        pairRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
