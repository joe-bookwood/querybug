import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ToupleFormService } from './touple-form.service';
import { ToupleService } from '../service/touple.service';
import { ITouple } from '../touple.model';
import { ICalculation } from 'app/entities/calculation/calculation.model';
import { CalculationService } from 'app/entities/calculation/service/calculation.service';
import { IOhlc } from 'app/entities/ohlc/ohlc.model';
import { OhlcService } from 'app/entities/ohlc/service/ohlc.service';

import { ToupleUpdateComponent } from './touple-update.component';

describe('Touple Management Update Component', () => {
  let comp: ToupleUpdateComponent;
  let fixture: ComponentFixture<ToupleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let toupleFormService: ToupleFormService;
  let toupleService: ToupleService;
  let calculationService: CalculationService;
  let ohlcService: OhlcService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ToupleUpdateComponent],
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
      .overrideTemplate(ToupleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ToupleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    toupleFormService = TestBed.inject(ToupleFormService);
    toupleService = TestBed.inject(ToupleService);
    calculationService = TestBed.inject(CalculationService);
    ohlcService = TestBed.inject(OhlcService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Calculation query and add missing value', () => {
      const touple: ITouple = { id: 456 };
      const calculation: ICalculation = { id: 96648 };
      touple.calculation = calculation;

      const calculationCollection: ICalculation[] = [{ id: 17926 }];
      jest.spyOn(calculationService, 'query').mockReturnValue(of(new HttpResponse({ body: calculationCollection })));
      const additionalCalculations = [calculation];
      const expectedCollection: ICalculation[] = [...additionalCalculations, ...calculationCollection];
      jest.spyOn(calculationService, 'addCalculationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ touple });
      comp.ngOnInit();

      expect(calculationService.query).toHaveBeenCalled();
      expect(calculationService.addCalculationToCollectionIfMissing).toHaveBeenCalledWith(
        calculationCollection,
        ...additionalCalculations.map(expect.objectContaining)
      );
      expect(comp.calculationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Ohlc query and add missing value', () => {
      const touple: ITouple = { id: 456 };
      const ohlc: IOhlc = { id: 5157 };
      touple.ohlc = ohlc;

      const ohlcCollection: IOhlc[] = [{ id: 1651 }];
      jest.spyOn(ohlcService, 'query').mockReturnValue(of(new HttpResponse({ body: ohlcCollection })));
      const additionalOhlcs = [ohlc];
      const expectedCollection: IOhlc[] = [...additionalOhlcs, ...ohlcCollection];
      jest.spyOn(ohlcService, 'addOhlcToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ touple });
      comp.ngOnInit();

      expect(ohlcService.query).toHaveBeenCalled();
      expect(ohlcService.addOhlcToCollectionIfMissing).toHaveBeenCalledWith(
        ohlcCollection,
        ...additionalOhlcs.map(expect.objectContaining)
      );
      expect(comp.ohlcsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const touple: ITouple = { id: 456 };
      const calculation: ICalculation = { id: 94835 };
      touple.calculation = calculation;
      const ohlc: IOhlc = { id: 67264 };
      touple.ohlc = ohlc;

      activatedRoute.data = of({ touple });
      comp.ngOnInit();

      expect(comp.calculationsSharedCollection).toContain(calculation);
      expect(comp.ohlcsSharedCollection).toContain(ohlc);
      expect(comp.touple).toEqual(touple);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITouple>>();
      const touple = { id: 123 };
      jest.spyOn(toupleFormService, 'getTouple').mockReturnValue(touple);
      jest.spyOn(toupleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ touple });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: touple }));
      saveSubject.complete();

      // THEN
      expect(toupleFormService.getTouple).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(toupleService.update).toHaveBeenCalledWith(expect.objectContaining(touple));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITouple>>();
      const touple = { id: 123 };
      jest.spyOn(toupleFormService, 'getTouple').mockReturnValue({ id: null });
      jest.spyOn(toupleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ touple: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: touple }));
      saveSubject.complete();

      // THEN
      expect(toupleFormService.getTouple).toHaveBeenCalled();
      expect(toupleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITouple>>();
      const touple = { id: 123 };
      jest.spyOn(toupleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ touple });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(toupleService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCalculation', () => {
      it('Should forward to calculationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(calculationService, 'compareCalculation');
        comp.compareCalculation(entity, entity2);
        expect(calculationService.compareCalculation).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareOhlc', () => {
      it('Should forward to ohlcService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(ohlcService, 'compareOhlc');
        comp.compareOhlc(entity, entity2);
        expect(ohlcService.compareOhlc).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
