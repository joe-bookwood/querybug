package de.bitc.se.service;

import static org.junit.jupiter.api.Assertions.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import de.bitc.se.IntegrationTest;
import de.bitc.se.domain.*;
import de.bitc.se.repository.*;
import de.bitc.se.service.dto.CalculationRepairDTO;
import de.bitc.se.service.helper.CalculationJsonTestData;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.util.*;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.shaded.org.apache.commons.io.IOUtils;

@IntegrationTest
@AutoConfigureMockMvc
@Transactional
class CalculationServiceIT {

    @Autowired
    private CalculationService calculationService;

    @Autowired
    private ChartRepository chartRepository;

    @Autowired
    private PairRepository pairRepository;

    @Autowired
    private TimeRangeRepository timeRangeRepository;

    @Autowired
    private OhlcRepository ohlcRepository;

    @Autowired
    private TupleRepository tupleRepository;

    @Autowired
    private CalculationRepository calculationRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private EntityManager entityManager;

    private Set<Integer> ranges;

    private List<TimeRange> timeRanges;
    private Pair pair;
    private List<Chart> charts;

    private Chart chart;

    private final Map<ZonedDateTime, Ohlc> ohlcs = new HashMap<>();
    private ObjectMapper objectMapper;
    private Calculation calculation;

    @BeforeEach
    void setUp() throws IOException {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        init();
    }

    private void init() throws IOException {
        ranges = Set.of(1, 5, 15, 30, 60, 240, 1440);
        tupleRepository.deleteAll();
        ohlcRepository.deleteAll();
        calculationRepository.deleteAll();

        timeRanges = timeRangeRepository.findAll();
        String json = IOUtils.toString(
            Objects.requireNonNull(this.getClass().getResourceAsStream("/json/pair.json")),
            StandardCharsets.UTF_8
        );

        pair = objectMapper.readValue(json, Pair.class);
        assetRepository.saveAndFlush(pair.getBase());
        assetRepository.saveAndFlush(pair.getQuote());
        pair = pairRepository.saveAndFlush(pair);

        json = IOUtils.toString(Objects.requireNonNull(this.getClass().getResourceAsStream("/json/chart.json")), StandardCharsets.UTF_8);
        chart = objectMapper.readValue(json, Chart.class);
        chart.setPair(pair);
        timeRangeRepository.saveAndFlush(chart.getTimeRange());
        chart = chartRepository.saveAndFlush(chart);

        json =
            IOUtils.toString(Objects.requireNonNull(this.getClass().getResourceAsStream("/json/calculation.json")), StandardCharsets.UTF_8);
        calculation = objectMapper.readValue(json, Calculation.class);
        calculation.setChart(chart);
        calculationRepository.saveAndFlush(calculation);
    }

    @Test
    public void testFetchRepair() throws IOException {
        // init test data
        String json = IOUtils.toString(
            Objects.requireNonNull(this.getClass().getResourceAsStream("/json/broken-data.json")),
            StandardCharsets.UTF_8
        );
        assertNotNull(json);

        CalculationJsonTestData testData = objectMapper.readValue(json, CalculationJsonTestData.class);
        assertNotNull(testData);

        testData
            .getOhlcs()
            .stream()
            .sorted(Comparator.comparing(Ohlc::getTime))
            .forEach(ohlc -> {
                ohlc.setId(null);
                ohlc.setChart(chart);
                Ohlc saved = ohlcRepository.saveAndFlush(ohlc);
                ohlcs.put(saved.getTime(), saved);
            });
        testData
            .getTuples()
            .stream()
            .sorted(Comparator.comparing(Tuple::getTime))
            .forEach(t -> {
                Ohlc ohlc = ohlcs.get(t.getTime());
                t.setId(null);
                t.setOhlc(ohlc);
                t.setCalculation(calculation);
                tupleRepository.saveAndFlush(t);
            });

        // Start Hibernate tests
        Long calculationId = calculation.getId(); // This is the Id of the calculation
        Query subQuery = entityManager
            .createNativeQuery(
                "select ca.id as ca_id, chart_id, range_size from calculation ca inner join chart c on c.id = ca.chart_id inner join time_range tr on tr.id = c.time_range_id where ca.id = :calculationid"
            )
            .setParameter("calculationid", calculationId);
        List<Object[]> resSubquery = subQuery.getResultList();
        assertNotNull(resSubquery);
        assertFalse(resSubquery.isEmpty());

        Query withQuerySimple = entityManager
            .createNativeQuery(
                "with params as (select ca.id as ca_id, chart_id, range_size, range_size * interval '1' minute as size from calculation ca inner join chart c on c.id = ca.chart_id inner join time_range tr on tr.id = c.time_range_id where ca.id = :calculationid) select ca_id,chart_id,range_size from params order by ca_id;"
            )
            .setParameter("calculationid", calculationId);
        List<Object[]> resSimpleWith = withQuerySimple.getResultList();
        assertNotNull(resSimpleWith);
        assertFalse(resSimpleWith.isEmpty());
        assertEquals(15, resSimpleWith.get(0)[2], "range_size must be 15");

        Query withQuerySimpleSecondPart = entityManager
            .createNativeQuery(
                "with tuple_diff as (select t.calculation_id, t.id, t.ohlc_id, t.time, t.time - lag(t.time, 1) over (order by t.time) as diff from tuple t where calculation_id = :calculationid ) select calculation_id,time from tuple_diff order by calculation_id;"
            )
            .setParameter("calculationid", calculationId);
        List<Object[]> resSimpleWithSecondPart = withQuerySimpleSecondPart.getResultList();
        assertNotNull(resSimpleWithSecondPart);
        assertFalse(resSimpleWithSecondPart.isEmpty());

        Query impossibleJoin = entityManager
            .createNativeQuery(
                "with params as (select ca.id as ca_id, chart_id, range_size, range_size * interval '1' minute as size from calculation ca inner join chart c on c.id = ca.chart_id inner join time_range tr on tr.id = c.time_range_id where ca.id = :calculationid), tuple_diff as (select t.calculation_id, t.id, t.ohlc_id, t.time, t.time - lag(t.time, 1) over (order by t.time) as diff from tuple t inner join params p on p.ca_id = t.CALCULATION_ID) select calculation_id from tuple_diff order by calculation_id;"
            )
            .setParameter("calculationid", calculationId);
        List<Object[]> resImpossibleJoin = impossibleJoin.getResultList();
        assertNotNull(resImpossibleJoin);
        assertFalse(resImpossibleJoin.isEmpty(), "result should not be empty");

        // test native query in spring boot
        Optional<CalculationRepairDTO> result = calculationService.calculationRepair(calculationId);

        assertTrue(result.isPresent());
    }
    
    @Test
    @Disabled
    public void testingTest() throws IOException {
        // init test data
        String json = IOUtils.toString(
            Objects.requireNonNull(this.getClass().getResourceAsStream("/json/broken-data.json")),
            StandardCharsets.UTF_8
        );
        assertNotNull(json);

        CalculationJsonTestData testData = objectMapper.readValue(json, CalculationJsonTestData.class);
        assertNotNull(testData);

        testData
            .getOhlcs()
            .stream()
            .sorted(Comparator.comparing(Ohlc::getTime))
            .forEach(ohlc -> {
                ohlc.setId(null);
                ohlc.setChart(chart);
                Ohlc saved = ohlcRepository.saveAndFlush(ohlc);
                ohlcs.put(saved.getTime(), saved);
            });
        testData
            .getTuples()
            .stream()
            .sorted(Comparator.comparing(Tuple::getTime))
            .forEach(t -> {
                Ohlc ohlc = ohlcs.get(t.getTime());
                t.setId(null);
                t.setOhlc(ohlc);
                t.setCalculation(calculation);
                tupleRepository.saveAndFlush(t);
            });
        Long calculationId = calculation.getId(); // This is the Id of the calculation

        Query impossibleJoin = entityManager
            .createNativeQuery(
                "with params as (select ca.id as ca_id, chart_id, range_size, range_size * interval '1' minute as size from calculation ca inner join chart c on c.id = ca.chart_id inner join time_range tr on tr.id = c.time_range_id where ca.id = :calculationid)," +
                " tuple_diff as (select t.calculation_id, t.id, t.ohlc_id, t.time " +
                //", t.time - lag(t.time, 1) over (order by t.time) as diff"+
                " from tuple t inner join params p on p.ca_id = t.calculation_id ) " +
                "select time from tuple_diff;"
            )
            .setParameter("calculationid", calculationId);
        List<Object[]> resImpossibleJoin = impossibleJoin.getResultList();
        assertNotNull(resImpossibleJoin);
        assertFalse(resImpossibleJoin.isEmpty(), "result should not be empty");
    }

}
