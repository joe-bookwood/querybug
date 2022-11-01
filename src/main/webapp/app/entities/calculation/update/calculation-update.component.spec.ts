import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CalculationFormService } from './calculation-form.service';
import { CalculationService } from '../service/calculation.service';
import { ICalculation } from '../calculation.model';
import { IChart } from 'app/entities/chart/chart.model';
import { ChartService } from 'app/entities/chart/service/chart.service';

import { CalculationUpdateComponent } from './calculation-update.component';

describe('Calculation Management Update Component', () => {
  let comp: CalculationUpdateComponent;
  let fixture: ComponentFixture<CalculationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let calculationFormService: CalculationFormService;
  let calculationService: CalculationService;
  let chartService: ChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CalculationUpdateComponent],
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
      .overrideTemplate(CalculationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CalculationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    calculationFormService = TestBed.inject(CalculationFormService);
    calculationService = TestBed.inject(CalculationService);
    chartService = TestBed.inject(ChartService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Chart query and add missing value', () => {
      const calculation: ICalculation = { id: 456 };
      const chart: IChart = { id: 83880 };
      calculation.chart = chart;

      const chartCollection: IChart[] = [{ id: 14617 }];
      jest.spyOn(chartService, 'query').mockReturnValue(of(new HttpResponse({ body: chartCollection })));
      const additionalCharts = [chart];
      const expectedCollection: IChart[] = [...additionalCharts, ...chartCollection];
      jest.spyOn(chartService, 'addChartToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ calculation });
      comp.ngOnInit();

      expect(chartService.query).toHaveBeenCalled();
      expect(chartService.addChartToCollectionIfMissing).toHaveBeenCalledWith(
        chartCollection,
        ...additionalCharts.map(expect.objectContaining)
      );
      expect(comp.chartsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const calculation: ICalculation = { id: 456 };
      const chart: IChart = { id: 42040 };
      calculation.chart = chart;

      activatedRoute.data = of({ calculation });
      comp.ngOnInit();

      expect(comp.chartsSharedCollection).toContain(chart);
      expect(comp.calculation).toEqual(calculation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICalculation>>();
      const calculation = { id: 123 };
      jest.spyOn(calculationFormService, 'getCalculation').mockReturnValue(calculation);
      jest.spyOn(calculationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ calculation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: calculation }));
      saveSubject.complete();

      // THEN
      expect(calculationFormService.getCalculation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(calculationService.update).toHaveBeenCalledWith(expect.objectContaining(calculation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICalculation>>();
      const calculation = { id: 123 };
      jest.spyOn(calculationFormService, 'getCalculation').mockReturnValue({ id: null });
      jest.spyOn(calculationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ calculation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: calculation }));
      saveSubject.complete();

      // THEN
      expect(calculationFormService.getCalculation).toHaveBeenCalled();
      expect(calculationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICalculation>>();
      const calculation = { id: 123 };
      jest.spyOn(calculationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ calculation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(calculationService.update).toHaveBeenCalled();
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
