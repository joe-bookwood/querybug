package de.bitc.se.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Tuple.
 */
@Entity
@Table(name = "tuple")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Tuple implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "computation", precision = 21, scale = 2)
    private BigDecimal computation;

    @Column(name = "time")
    private ZonedDateTime time;

    @ManyToOne
    @JsonIgnoreProperties(value = { "chart" }, allowSetters = true)
    private Calculation calculation;

    @ManyToOne
    @JsonIgnoreProperties(value = { "chart" }, allowSetters = true)
    private Ohlc ohlc;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Tuple id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getComputation() {
        return this.computation;
    }

    public Tuple computation(BigDecimal computation) {
        this.setComputation(computation);
        return this;
    }

    public void setComputation(BigDecimal computation) {
        this.computation = computation;
    }

    public ZonedDateTime getTime() {
        return this.time;
    }

    public Tuple time(ZonedDateTime time) {
        this.setTime(time);
        return this;
    }

    public void setTime(ZonedDateTime time) {
        this.time = time;
    }

    public Calculation getCalculation() {
        return this.calculation;
    }

    public void setCalculation(Calculation calculation) {
        this.calculation = calculation;
    }

    public Tuple calculation(Calculation calculation) {
        this.setCalculation(calculation);
        return this;
    }

    public Ohlc getOhlc() {
        return this.ohlc;
    }

    public void setOhlc(Ohlc ohlc) {
        this.ohlc = ohlc;
    }

    public Tuple ohlc(Ohlc ohlc) {
        this.setOhlc(ohlc);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tuple)) {
            return false;
        }
        return id != null && id.equals(((Tuple) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Tuple{" +
            "id=" + getId() +
            ", computation=" + getComputation() +
            ", time='" + getTime() + "'" +
            "}";
    }
}
