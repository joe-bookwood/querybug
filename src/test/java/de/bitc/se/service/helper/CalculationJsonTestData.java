package de.bitc.se.service.helper;

import de.bitc.se.domain.Ohlc;
import de.bitc.se.domain.Touple;
import java.util.ArrayList;
import java.util.List;

public class CalculationJsonTestData {

    private List<Touple> touples = new ArrayList<>();

    private List<Ohlc> ohlcs = new ArrayList<>();

    public CalculationJsonTestData() {}

    public List<Touple> getTouples() {
        return touples;
    }

    public void setTouples(List<Touple> touples) {
        this.touples = touples;
    }

    public List<Ohlc> getOhlcs() {
        return ohlcs;
    }

    public void setOhlcs(List<Ohlc> ohlcs) {
        this.ohlcs = ohlcs;
    }
}
