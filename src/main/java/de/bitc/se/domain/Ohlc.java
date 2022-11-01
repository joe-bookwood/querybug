package de.bitc.se.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Ohlc.
 */
@Entity
@Table(name = "ohlc")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Ohlc implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "time")
    private ZonedDateTime time;

    @Column(name = "open", precision = 21, scale = 2)
    private BigDecimal open;

    @Column(name = "high", precision = 21, scale = 2)
    private BigDecimal high;

    @Column(name = "low", precision = 21, scale = 2)
    private BigDecimal low;

    @Column(name = "close", precision = 21, scale = 2)
    private BigDecimal close;

    @Column(name = "volume_weighted_average_price", precision = 21, scale = 2)
    private BigDecimal volumeWeightedAveragePrice;

    @Column(name = "volume", precision = 21, scale = 2)
    private BigDecimal volume;

    @Column(name = "count")
    private Integer count;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "pair", "timeRange" }, allowSetters = true)
    private Chart chart;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Ohlc id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getTime() {
        return this.time;
    }

    public Ohlc time(ZonedDateTime time) {
        this.setTime(time);
        return this;
    }

    public void setTime(ZonedDateTime time) {
        this.time = time;
    }

    public BigDecimal getOpen() {
        return this.open;
    }

    public Ohlc open(BigDecimal open) {
        this.setOpen(open);
        return this;
    }

    public void setOpen(BigDecimal open) {
        this.open = open;
    }

    public BigDecimal getHigh() {
        return this.high;
    }

    public Ohlc high(BigDecimal high) {
        this.setHigh(high);
        return this;
    }

    public void setHigh(BigDecimal high) {
        this.high = high;
    }

    public BigDecimal getLow() {
        return this.low;
    }

    public Ohlc low(BigDecimal low) {
        this.setLow(low);
        return this;
    }

    public void setLow(BigDecimal low) {
        this.low = low;
    }

    public BigDecimal getClose() {
        return this.close;
    }

    public Ohlc close(BigDecimal close) {
        this.setClose(close);
        return this;
    }

    public void setClose(BigDecimal close) {
        this.close = close;
    }

    public BigDecimal getVolumeWeightedAveragePrice() {
        return this.volumeWeightedAveragePrice;
    }

    public Ohlc volumeWeightedAveragePrice(BigDecimal volumeWeightedAveragePrice) {
        this.setVolumeWeightedAveragePrice(volumeWeightedAveragePrice);
        return this;
    }

    public void setVolumeWeightedAveragePrice(BigDecimal volumeWeightedAveragePrice) {
        this.volumeWeightedAveragePrice = volumeWeightedAveragePrice;
    }

    public BigDecimal getVolume() {
        return this.volume;
    }

    public Ohlc volume(BigDecimal volume) {
        this.setVolume(volume);
        return this;
    }

    public void setVolume(BigDecimal volume) {
        this.volume = volume;
    }

    public Integer getCount() {
        return this.count;
    }

    public Ohlc count(Integer count) {
        this.setCount(count);
        return this;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Chart getChart() {
        return this.chart;
    }

    public void setChart(Chart chart) {
        this.chart = chart;
    }

    public Ohlc chart(Chart chart) {
        this.setChart(chart);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ohlc)) {
            return false;
        }
        return id != null && id.equals(((Ohlc) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ohlc{" +
            "id=" + getId() +
            ", time='" + getTime() + "'" +
            ", open=" + getOpen() +
            ", high=" + getHigh() +
            ", low=" + getLow() +
            ", close=" + getClose() +
            ", volumeWeightedAveragePrice=" + getVolumeWeightedAveragePrice() +
            ", volume=" + getVolume() +
            ", count=" + getCount() +
            "}";
    }
}
