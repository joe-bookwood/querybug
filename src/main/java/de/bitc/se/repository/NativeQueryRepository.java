package de.bitc.se.repository;

import de.bitc.se.domain.Tuple;
import de.bitc.se.domain.projection.CalculationRepairInfo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NativeQueryRepository extends JpaRepository<Tuple, Long> {
    @Query(
        value = "with params as (select ca.id as calculation_id, chart_id, range_size, range_size * interval '1' minute as size from calculation ca inner join chart c on c.id = ca.chart_id inner join time_range tr on tr.id = c.time_range_id where ca.id = :calculationid), tuple_diff as (select t.calculation_id, t.id, t.ohlc_id, t.time, t.time - lag(t.time, 1) over (order by t.time) as diff from tuple t inner join params p on t.calculation_id = p.calculation_id), ohlc_diff as (select o.chart_id, o.id, o.time, o.time - lag(o.time, 1) over (order by o.time) as diff from ohlc o inner join params p on o.chart_id = p.chart_id), tuple_filtered as (select id, ohlc_id, time, diff, p.size, p.range_size from tuple_diff t inner join params p on chart_id = p.chart_id where diff <> p.size), ohlc_filtered as (select o.chart_id, o.id as ohlc_id, time from ohlc_diff o inner join params p on o.chart_id = p.chart_id where o.diff <> p.size) select t.time as time, t.range_size as size from tuple_filtered t left join ohlc_filtered o on t.time = o.time where o.ohlc_id is null order by t.time;",
        nativeQuery = true
    )
    List<CalculationRepairInfo> inconsistentTime(@Param("calculationid") Long calculationId);
}
