package de.bitc.se.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Chart.
 */
@Entity
@Table(name = "chart")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Chart implements Serializable {

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

    @Column(name = "max_count")
    private Integer maxCount;

    @Column(name = "disabled")
    private Boolean disabled;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "fees", "base", "quote" }, allowSetters = true)
    private Pair pair;

    @ManyToOne(optional = false)
    @NotNull
    private TimeRange timeRange;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Chart id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Chart name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ZonedDateTime getLast() {
        return this.last;
    }

    public Chart last(ZonedDateTime last) {
        this.setLast(last);
        return this;
    }

    public void setLast(ZonedDateTime last) {
        this.last = last;
    }

    public Integer getMaxCount() {
        return this.maxCount;
    }

    public Chart maxCount(Integer maxCount) {
        this.setMaxCount(maxCount);
        return this;
    }

    public void setMaxCount(Integer maxCount) {
        this.maxCount = maxCount;
    }

    public Boolean getDisabled() {
        return this.disabled;
    }

    public Chart disabled(Boolean disabled) {
        this.setDisabled(disabled);
        return this;
    }

    public void setDisabled(Boolean disabled) {
        this.disabled = disabled;
    }

    public Pair getPair() {
        return this.pair;
    }

    public void setPair(Pair pair) {
        this.pair = pair;
    }

    public Chart pair(Pair pair) {
        this.setPair(pair);
        return this;
    }

    public TimeRange getTimeRange() {
        return this.timeRange;
    }

    public void setTimeRange(TimeRange timeRange) {
        this.timeRange = timeRange;
    }

    public Chart timeRange(TimeRange timeRange) {
        this.setTimeRange(timeRange);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Chart)) {
            return false;
        }
        return id != null && id.equals(((Chart) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Chart{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", last='" + getLast() + "'" +
            ", maxCount=" + getMaxCount() +
            ", disabled='" + getDisabled() + "'" +
            "}";
    }
}
