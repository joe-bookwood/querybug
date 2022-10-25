import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChartFormService } from './chart-form.service';
import { ChartService } from '../service/chart.service';
import { IChart } from '../chart.model';
import { IPair } from 'app/entities/pair/pair.model';
import { PairService } from 'app/entities/pair/service/pair.service';
import { ITimeRange } from 'app/entities/time-range/time-range.model';
import { TimeRangeService } from 'app/entities/time-range/service/time-range.service';

import { ChartUpdateComponent } from './chart-update.component';

describe('Chart Management Update Component', () => {
  let comp: ChartUpdateComponent;
  let fixture: ComponentFixture<ChartUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chartFormService: ChartFormService;
  let chartService: ChartService;
  let pairService: PairService;
  let timeRangeService: TimeRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChartUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ChartUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChartUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chartFormService = TestBed.inject(ChartFormService);
    chartService = TestBed.inject(ChartService);
    pairService = TestBed.inject(PairService);
    timeRangeService = TestBed.inject(TimeRangeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Pair query and add missing value', () => {
      const chart: IChart = { id: 456 };
      const pair: IPair = { id: 43971 };
      chart.pair = pair;

      const pairCollection: IPair[] = [{ id: 61779 }];
      jest.spyOn(pairService, 'query').mockReturnValue(of(new HttpResponse({ body: pairCollection })));
      const additionalPairs = [pair];
      const expectedCollection: IPair[] = [...additionalPairs, ...pairCollection];
      jest.spyOn(pairService, 'addPairToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chart });
      comp.ngOnInit();

      expect(pairService.query).toHaveBeenCalled();
      expect(pairService.addPairToCollectionIfMissing).toHaveBeenCalledWith(
        pairCollection,
        ...additionalPairs.map(expect.objectContaining)
      );
      expect(comp.pairsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call TimeRange query and add missing value', () => {
      const chart: IChart = { id: 456 };
      const timeRange: ITimeRange = { id: 75199 };
      chart.timeRange = timeRange;

      const timeRangeCollection: ITimeRange[] = [{ id: 44535 }];
      jest.spyOn(timeRangeService, 'query').mockReturnValue(of(new HttpResponse({ body: timeRangeCollection })));
      const additionalTimeRanges = [timeRange];
      const expectedCollection: ITimeRange[] = [...additionalTimeRanges, ...timeRangeCollection];
      jest.spyOn(timeRangeService, 'addTimeRangeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chart });
      comp.ngOnInit();

      expect(timeRangeService.query).toHaveBeenCalled();
      expect(timeRangeService.addTimeRangeToCollectionIfMissing).toHaveBeenCalledWith(
        timeRangeCollection,
        ...additionalTimeRanges.map(expect.objectContaining)
      );
      expect(comp.timeRangesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chart: IChart = { id: 456 };
      const pair: IPair = { id: 33771 };
      chart.pair = pair;
      const timeRange: ITimeRange = { id: 47285 };
      chart.timeRange = timeRange;

      activatedRoute.data = of({ chart });
      comp.ngOnInit();

      expect(comp.pairsSharedCollection).toContain(pair);
      expect(comp.timeRangesSharedCollection).toContain(timeRange);
      expect(comp.chart).toEqual(chart);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChart>>();
      const chart = { id: 123 };
      jest.spyOn(chartFormService, 'getChart').mockReturnValue(chart);
      jest.spyOn(chartService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chart }));
      saveSubject.complete();

      // THEN
      expect(chartFormService.getChart).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(chartService.update).toHaveBeenCalledWith(expect.objectContaining(chart));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChart>>();
      const chart = { id: 123 };
      jest.spyOn(chartFormService, 'getChart').mockReturnValue({ id: null });
      jest.spyOn(chartService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chart: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chart }));
      saveSubject.complete();

      // THEN
      expect(chartFormService.getChart).toHaveBeenCalled();
      expect(chartService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChart>>();
      const chart = { id: 123 };
      jest.spyOn(chartService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chartService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePair', () => {
      it('Should forward to pairService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(pairService, 'comparePair');
        comp.comparePair(entity, entity2);
        expect(pairService.comparePair).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTimeRange', () => {
      it('Should forward to timeRangeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(timeRangeService, 'compareTimeRange');
        comp.compareTimeRange(entity, entity2);
        expect(timeRangeService.compareTimeRange).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
