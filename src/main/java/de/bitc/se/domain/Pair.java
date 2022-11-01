package de.bitc.se.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Pair.
 */
@Entity
@Table(name = "pair")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Pair implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "altname")
    private String altname;

    @Column(name = "web_socket_pair_name")
    private String webSocketPairName;

    @Column(name = "lot")
    private String lot;

    @Column(name = "pair_decimal")
    private Integer pairDecimal;

    @Column(name = "lot_decimals")
    private Integer lotDecimals;

    @Column(name = "lot_multiplier")
    private Integer lotMultiplier;

    @OneToMany(mappedBy = "pair")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pair" }, allowSetters = true)
    private Set<Fee> fees = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    private Asset base;

    @ManyToOne(optional = false)
    @NotNull
    private Asset quote;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Pair id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Pair name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAltname() {
        return this.altname;
    }

    public Pair altname(String altname) {
        this.setAltname(altname);
        return this;
    }

    public void setAltname(String altname) {
        this.altname = altname;
    }

    public String getWebSocketPairName() {
        return this.webSocketPairName;
    }

    public Pair webSocketPairName(String webSocketPairName) {
        this.setWebSocketPairName(webSocketPairName);
        return this;
    }

    public void setWebSocketPairName(String webSocketPairName) {
        this.webSocketPairName = webSocketPairName;
    }

    public String getLot() {
        return this.lot;
    }

    public Pair lot(String lot) {
        this.setLot(lot);
        return this;
    }

    public void setLot(String lot) {
        this.lot = lot;
    }

    public Integer getPairDecimal() {
        return this.pairDecimal;
    }

    public Pair pairDecimal(Integer pairDecimal) {
        this.setPairDecimal(pairDecimal);
        return this;
    }

    public void setPairDecimal(Integer pairDecimal) {
        this.pairDecimal = pairDecimal;
    }

    public Integer getLotDecimals() {
        return this.lotDecimals;
    }

    public Pair lotDecimals(Integer lotDecimals) {
        this.setLotDecimals(lotDecimals);
        return this;
    }

    public void setLotDecimals(Integer lotDecimals) {
        this.lotDecimals = lotDecimals;
    }

    public Integer getLotMultiplier() {
        return this.lotMultiplier;
    }

    public Pair lotMultiplier(Integer lotMultiplier) {
        this.setLotMultiplier(lotMultiplier);
        return this;
    }

    public void setLotMultiplier(Integer lotMultiplier) {
        this.lotMultiplier = lotMultiplier;
    }

    public Set<Fee> getFees() {
        return this.fees;
    }

    public void setFees(Set<Fee> fees) {
        if (this.fees != null) {
            this.fees.forEach(i -> i.setPair(null));
        }
        if (fees != null) {
            fees.forEach(i -> i.setPair(this));
        }
        this.fees = fees;
    }

    public Pair fees(Set<Fee> fees) {
        this.setFees(fees);
        return this;
    }

    public Pair addFees(Fee fee) {
        this.fees.add(fee);
        fee.setPair(this);
        return this;
    }

    public Pair removeFees(Fee fee) {
        this.fees.remove(fee);
        fee.setPair(null);
        return this;
    }

    public Asset getBase() {
        return this.base;
    }

    public void setBase(Asset asset) {
        this.base = asset;
    }

    public Pair base(Asset asset) {
        this.setBase(asset);
        return this;
    }

    public Asset getQuote() {
        return this.quote;
    }

    public void setQuote(Asset asset) {
        this.quote = asset;
    }

    public Pair quote(Asset asset) {
        this.setQuote(asset);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pair)) {
            return false;
        }
        return id != null && id.equals(((Pair) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pair{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", altname='" + getAltname() + "'" +
            ", webSocketPairName='" + getWebSocketPairName() + "'" +
            ", lot='" + getLot() + "'" +
            ", pairDecimal=" + getPairDecimal() +
            ", lotDecimals=" + getLotDecimals() +
            ", lotMultiplier=" + getLotMultiplier() +
            "}";
    }
}
