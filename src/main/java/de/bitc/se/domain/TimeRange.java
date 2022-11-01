package de.bitc.se.domain;

import java.io.Serializable;
import java.time.Duration;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TimeRange.
 */
@Entity
@Table(name = "time_range")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TimeRange implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "range_size")
    private Integer rangeSize;

    @Column(name = "duration")
    private Duration duration;

    @Column(name = "description")
    private String description;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TimeRange id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public TimeRange name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getRangeSize() {
        return this.rangeSize;
    }

    public TimeRange rangeSize(Integer rangeSize) {
        this.setRangeSize(rangeSize);
        return this;
    }

    public void setRangeSize(Integer rangeSize) {
        this.rangeSize = rangeSize;
    }

    public Duration getDuration() {
        return this.duration;
    }

    public TimeRange duration(Duration duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Duration duration) {
        this.duration = duration;
    }

    public String getDescription() {
        return this.description;
    }

    public TimeRange description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TimeRange)) {
            return false;
        }
        return id != null && id.equals(((TimeRange) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TimeRange{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", rangeSize=" + getRangeSize() +
            ", duration='" + getDuration() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
