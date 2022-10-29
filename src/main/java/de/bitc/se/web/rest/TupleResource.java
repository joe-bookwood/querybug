package de.bitc.se.web.rest;

import de.bitc.se.domain.Tuple;
import de.bitc.se.repository.TupleRepository;
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
 * REST controller for managing {@link de.bitc.se.domain.Tuple}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TupleResource {

    private final Logger log = LoggerFactory.getLogger(TupleResource.class);

    private static final String ENTITY_NAME = "tuple";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TupleRepository tupleRepository;

    public TupleResource(TupleRepository tupleRepository) {
        this.tupleRepository = tupleRepository;
    }

    /**
     * {@code POST  /tuples} : Create a new tuple.
     *
     * @param tuple the tuple to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tuple, or with status {@code 400 (Bad Request)} if the tuple has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tuples")
    public ResponseEntity<Tuple> createTuple(@RequestBody Tuple tuple) throws URISyntaxException {
        log.debug("REST request to save Tuple : {}", tuple);
        if (tuple.getId() != null) {
            throw new BadRequestAlertException("A new tuple cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Tuple result = tupleRepository.save(tuple);
        return ResponseEntity
            .created(new URI("/api/tuples/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tuples/:id} : Updates an existing tuple.
     *
     * @param id the id of the tuple to save.
     * @param tuple the tuple to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tuple,
     * or with status {@code 400 (Bad Request)} if the tuple is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tuple couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tuples/{id}")
    public ResponseEntity<Tuple> updateTuple(@PathVariable(value = "id", required = false) final Long id, @RequestBody Tuple tuple)
        throws URISyntaxException {
        log.debug("REST request to update Tuple : {}, {}", id, tuple);
        if (tuple.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tuple.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tupleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Tuple result = tupleRepository.save(tuple);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tuple.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tuples/:id} : Partial updates given fields of an existing tuple, field will ignore if it is null
     *
     * @param id the id of the tuple to save.
     * @param tuple the tuple to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tuple,
     * or with status {@code 400 (Bad Request)} if the tuple is not valid,
     * or with status {@code 404 (Not Found)} if the tuple is not found,
     * or with status {@code 500 (Internal Server Error)} if the tuple couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tuples/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Tuple> partialUpdateTuple(@PathVariable(value = "id", required = false) final Long id, @RequestBody Tuple tuple)
        throws URISyntaxException {
        log.debug("REST request to partial update Tuple partially : {}, {}", id, tuple);
        if (tuple.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tuple.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tupleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Tuple> result = tupleRepository
            .findById(tuple.getId())
            .map(existingTuple -> {
                if (tuple.getComputation() != null) {
                    existingTuple.setComputation(tuple.getComputation());
                }
                if (tuple.getTime() != null) {
                    existingTuple.setTime(tuple.getTime());
                }

                return existingTuple;
            })
            .map(tupleRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tuple.getId().toString())
        );
    }

    /**
     * {@code GET  /tuples} : get all the tuples.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tuples in body.
     */
    @GetMapping("/tuples")
    public List<Tuple> getAllTuples() {
        log.debug("REST request to get all Tuples");
        return tupleRepository.findAll();
    }

    /**
     * {@code GET  /tuples/:id} : get the "id" tuple.
     *
     * @param id the id of the tuple to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tuple, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tuples/{id}")
    public ResponseEntity<Tuple> getTuple(@PathVariable Long id) {
        log.debug("REST request to get Tuple : {}", id);
        Optional<Tuple> tuple = tupleRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tuple);
    }

    /**
     * {@code DELETE  /tuples/:id} : delete the "id" tuple.
     *
     * @param id the id of the tuple to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tuples/{id}")
    public ResponseEntity<Void> deleteTuple(@PathVariable Long id) {
        log.debug("REST request to delete Tuple : {}", id);
        tupleRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
