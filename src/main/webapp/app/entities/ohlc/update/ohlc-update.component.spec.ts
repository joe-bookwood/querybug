import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OhlcFormService } from './ohlc-form.service';
import { OhlcService } from '../service/ohlc.service';
import { IOhlc } from '../ohlc.model';
import { IChart } from 'app/entities/chart/chart.model';
import { ChartService } from 'app/entities/chart/service/chart.service';

import { OhlcUpdateComponent } from './ohlc-update.component';

describe('Ohlc Management Update Component', () => {
  let comp: OhlcUpdateComponent;
  let fixture: ComponentFixture<OhlcUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ohlcFormService: OhlcFormService;
  let ohlcService: OhlcService;
  let chartService: ChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OhlcUpdateComponent],
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
      .overrideTemplate(OhlcUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OhlcUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ohlcFormService = TestBed.inject(OhlcFormService);
    ohlcService = TestBed.inject(OhlcService);
    chartService = TestBed.inject(ChartService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Chart query and add missing value', () => {
      const ohlc: IOhlc = { id: 456 };
      const chart: IChart = { id: 61752 };
      ohlc.chart = chart;

      const chartCollection: IChart[] = [{ id: 28993 }];
      jest.spyOn(chartService, 'query').mockReturnValue(of(new HttpResponse({ body: chartCollection })));
      const additionalCharts = [chart];
      const expectedCollection: IChart[] = [...additionalCharts, ...chartCollection];
      jest.spyOn(chartService, 'addChartToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ohlc });
      comp.ngOnInit();

      expect(chartService.query).toHaveBeenCalled();
      expect(chartService.addChartToCollectionIfMissing).toHaveBeenCalledWith(
        chartCollection,
        ...additionalCharts.map(expect.objectContaining)
      );
      expect(comp.chartsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ohlc: IOhlc = { id: 456 };
      const chart: IChart = { id: 24029 };
      ohlc.chart = chart;

      activatedRoute.data = of({ ohlc });
      comp.ngOnInit();

      expect(comp.chartsSharedCollection).toContain(chart);
      expect(comp.ohlc).toEqual(ohlc);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOhlc>>();
      const ohlc = { id: 123 };
      jest.spyOn(ohlcFormService, 'getOhlc').mockReturnValue(ohlc);
      jest.spyOn(ohlcService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ohlc });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ohlc }));
      saveSubject.complete();

      // THEN
      expect(ohlcFormService.getOhlc).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ohlcService.update).toHaveBeenCalledWith(expect.objectContaining(ohlc));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOhlc>>();
      const ohlc = { id: 123 };
      jest.spyOn(ohlcFormService, 'getOhlc').mockReturnValue({ id: null });
      jest.spyOn(ohlcService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ohlc: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ohlc }));
      saveSubject.complete();

      // THEN
      expect(ohlcFormService.getOhlc).toHaveBeenCalled();
      expect(ohlcService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOhlc>>();
      const ohlc = { id: 123 };
      jest.spyOn(ohlcService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ohlc });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ohlcService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareChart', () => {
      it('Should forward to chartService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(chartService, 'compareChart');
        comp.compareChart(entity, entity2);
        expect(chartService.compareChart).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
