package de.bitc.se.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Asset.
 */
@Entity
@Table(name = "asset")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Asset implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "asset_class")
    private String assetClass;

    @Column(name = "alternative_name")
    private String alternativeName;

    @Column(name = "decimals")
    private Integer decimals;

    @Column(name = "display_decimals")
    private Integer displayDecimals;

    @Column(name = "last_checked")
    private ZonedDateTime lastChecked;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Asset id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Asset name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAssetClass() {
        return this.assetClass;
    }

    public Asset assetClass(String assetClass) {
        this.setAssetClass(assetClass);
        return this;
    }

    public void setAssetClass(String assetClass) {
        this.assetClass = assetClass;
    }

    public String getAlternativeName() {
        return this.alternativeName;
    }

    public Asset alternativeName(String alternativeName) {
        this.setAlternativeName(alternativeName);
        return this;
    }

    public void setAlternativeName(String alternativeName) {
        this.alternativeName = alternativeName;
    }

    public Integer getDecimals() {
        return this.decimals;
    }

    public Asset decimals(Integer decimals) {
        this.setDecimals(decimals);
        return this;
    }

    public void setDecimals(Integer decimals) {
        this.decimals = decimals;
    }

    public Integer getDisplayDecimals() {
        return this.displayDecimals;
    }

    public Asset displayDecimals(Integer displayDecimals) {
        this.setDisplayDecimals(displayDecimals);
        return this;
    }

    public void setDisplayDecimals(Integer displayDecimals) {
        this.displayDecimals = displayDecimals;
    }

    public ZonedDateTime getLastChecked() {
        return this.lastChecked;
    }

    public Asset lastChecked(ZonedDateTime lastChecked) {
        this.setLastChecked(lastChecked);
        return this;
    }

    public void setLastChecked(ZonedDateTime lastChecked) {
        this.lastChecked = lastChecked;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Asset)) {
            return false;
        }
        return id != null && id.equals(((Asset) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Asset{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", assetClass='" + getAssetClass() + "'" +
            ", alternativeName='" + getAlternativeName() + "'" +
            ", decimals=" + getDecimals() +
            ", displayDecimals=" + getDisplayDecimals() +
            ", lastChecked='" + getLastChecked() + "'" +
            "}";
    }
}
