package de.bitc.se.service;

import de.bitc.se.domain.projection.CalculationRepairInfo;
import de.bitc.se.repository.*;
import de.bitc.se.service.dto.CalculationRepairDTO;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CalculationService {

    private final Logger log = LoggerFactory.getLogger(CalculationService.class);

    private final CalculationRepository calculationRepository;

    private final TupleRepository tupleRepository;

    private final OhlcRepository ohlcRepository;

    private final ChartRepository chartRepository;

    @Autowired
    private NativeQueryRepository nativeQueryRepository;

    public CalculationService(
        CalculationRepository calculationRepository,
        TupleRepository tupleRepository,
        OhlcRepository ohlcRepository,
        ChartRepository chartRepository
    ) {
        this.calculationRepository = calculationRepository;
        this.tupleRepository = tupleRepository;
        this.ohlcRepository = ohlcRepository;
        this.chartRepository = chartRepository;
    }

    public Optional<CalculationRepairDTO> calculationRepair(Long calculationId) {
        List<CalculationRepairInfo> result = nativeQueryRepository.inconsistentTime(calculationId);
        if (result != null && !result.isEmpty()) {
            log.debug("bla {}", result);
            return Optional.of(new CalculationRepairDTO(result.get(0)));
        }
        return Optional.empty();
    }
}
