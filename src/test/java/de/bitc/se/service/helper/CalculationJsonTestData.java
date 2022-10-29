package de.bitc.se.service.helper;

import de.bitc.se.domain.Ohlc;
import de.bitc.se.domain.Tuple;
import java.util.ArrayList;
import java.util.List;

public class CalculationJsonTestData {

    private List<Tuple> tuples = new ArrayList<>();

    private List<Ohlc> ohlcs = new ArrayList<>();

    public CalculationJsonTestData() {}

    public List<Tuple> getTuples() {
        return tuples;
    }

    public void setTuples(List<Tuple> tuples) {
        this.tuples = tuples;
    }

    public List<Ohlc> getOhlcs() {
        return ohlcs;
    }

    public void setOhlcs(List<Ohlc> ohlcs) {
        this.ohlcs = ohlcs;
    }
}
