package de.bitc.se.web.rest;

import de.bitc.se.domain.Touple;
import de.bitc.se.repository.ToupleRepository;
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
 * REST controller for managing {@link de.bitc.se.domain.Touple}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ToupleResource {

    private final Logger log = LoggerFactory.getLogger(ToupleResource.class);

    private static final String ENTITY_NAME = "touple";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ToupleRepository toupleRepository;

    public ToupleResource(ToupleRepository toupleRepository) {
        this.toupleRepository = toupleRepository;
    }

    /**
     * {@code POST  /touples} : Create a new touple.
     *
     * @param touple the touple to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new touple, or with status {@code 400 (Bad Request)} if the touple has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/touples")
    public ResponseEntity<Touple> createTouple(@RequestBody Touple touple) throws URISyntaxException {
        log.debug("REST request to save Touple : {}", touple);
        if (touple.getId() != null) {
            throw new BadRequestAlertException("A new touple cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Touple result = toupleRepository.save(touple);
        return ResponseEntity
            .created(new URI("/api/touples/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /touples/:id} : Updates an existing touple.
     *
     * @param id the id of the touple to save.
     * @param touple the touple to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated touple,
     * or with status {@code 400 (Bad Request)} if the touple is not valid,
     * or with status {@code 500 (Internal Server Error)} if the touple couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/touples/{id}")
    public ResponseEntity<Touple> updateTouple(@PathVariable(value = "id", required = false) final Long id, @RequestBody Touple touple)
        throws URISyntaxException {
        log.debug("REST request to update Touple : {}, {}", id, touple);
        if (touple.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, touple.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!toupleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Touple result = toupleRepository.save(touple);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, touple.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /touples/:id} : Partial updates given fields of an existing touple, field will ignore if it is null
     *
     * @param id the id of the touple to save.
     * @param touple the touple to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated touple,
     * or with status {@code 400 (Bad Request)} if the touple is not valid,
     * or with status {@code 404 (Not Found)} if the touple is not found,
     * or with status {@code 500 (Internal Server Error)} if the touple couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/touples/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Touple> partialUpdateTouple(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Touple touple
    ) throws URISyntaxException {
        log.debug("REST request to partial update Touple partially : {}, {}", id, touple);
        if (touple.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, touple.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!toupleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Touple> result = toupleRepository
            .findById(touple.getId())
            .map(existingTouple -> {
                if (touple.getComputation() != null) {
                    existingTouple.setComputation(touple.getComputation());
                }
                if (touple.getTime() != null) {
                    existingTouple.setTime(touple.getTime());
                }

                return existingTouple;
            })
            .map(toupleRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, touple.getId().toString())
        );
    }

    /**
     * {@code GET  /touples} : get all the touples.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of touples in body.
     */
    @GetMapping("/touples")
    public List<Touple> getAllTouples() {
        log.debug("REST request to get all Touples");
        return toupleRepository.findAll();
    }

    /**
     * {@code GET  /touples/:id} : get the "id" touple.
     *
     * @param id the id of the touple to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the touple, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/touples/{id}")
    public ResponseEntity<Touple> getTouple(@PathVariable Long id) {
        log.debug("REST request to get Touple : {}", id);
        Optional<Touple> touple = toupleRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(touple);
    }

    /**
     * {@code DELETE  /touples/:id} : delete the "id" touple.
     *
     * @param id the id of the touple to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/touples/{id}")
    public ResponseEntity<Void> deleteTouple(@PathVariable Long id) {
        log.debug("REST request to delete Touple : {}", id);
        toupleRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
