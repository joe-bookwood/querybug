package de.bitc.se.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Calculation.
 */
@Entity
@Table(name = "calculation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Calculation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "last")
    private ZonedDateTime last;

    @Column(name = "disabled")
    private Boolean disabled;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "pair", "timeRange" }, allowSetters = true)
    private Chart chart;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Calculation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Calculation name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ZonedDateTime getLast() {
        return this.last;
    }

    public Calculation last(ZonedDateTime last) {
        this.setLast(last);
        return this;
    }

    public void setLast(ZonedDateTime last) {
        this.last = last;
    }

    public Boolean getDisabled() {
        return this.disabled;
    }

    public Calculation disabled(Boolean disabled) {
        this.setDisabled(disabled);
        return this;
    }

    public void setDisabled(Boolean disabled) {
        this.disabled = disabled;
    }

    public Chart getChart() {
        return this.chart;
    }

    public void setChart(Chart chart) {
        this.chart = chart;
    }

    public Calculation chart(Chart chart) {
        this.setChart(chart);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Calculation)) {
            return false;
        }
        return id != null && id.equals(((Calculation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Calculation{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", last='" + getLast() + "'" +
            ", disabled='" + getDisabled() + "'" +
            "}";
    }
}
