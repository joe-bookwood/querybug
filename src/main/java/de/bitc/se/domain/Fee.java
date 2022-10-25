package de.bitc.se.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Fee.
 */
@Entity
@Table(name = "fee")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Fee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "volume")
    private Integer volume;

    @Column(name = "percent", precision = 21, scale = 2)
    private BigDecimal percent;

    @ManyToOne
    @JsonIgnoreProperties(value = { "fees", "base", "quote" }, allowSetters = true)
    private Pair pair;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Fee id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getVolume() {
        return this.volume;
    }

    public Fee volume(Integer volume) {
        this.setVolume(volume);
        return this;
    }

    public void setVolume(Integer volume) {
        this.volume = volume;
    }

    public BigDecimal getPercent() {
        return this.percent;
    }

    public Fee percent(BigDecimal percent) {
        this.setPercent(percent);
        return this;
    }

    public void setPercent(BigDecimal percent) {
        this.percent = percent;
    }

    public Pair getPair() {
        return this.pair;
    }

    public void setPair(Pair pair) {
        this.pair = pair;
    }

    public Fee pair(Pair pair) {
        this.setPair(pair);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Fee)) {
            return false;
        }
        return id != null && id.equals(((Fee) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Fee{" +
            "id=" + getId() +
            ", volume=" + getVolume() +
            ", percent=" + getPercent() +
            "}";
    }
}
