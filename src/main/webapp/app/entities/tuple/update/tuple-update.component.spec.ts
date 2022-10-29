import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TupleFormService } from './tuple-form.service';
import { TupleService } from '../service/tuple.service';
import { ITuple } from '../tuple.model';
import { ICalculation } from 'app/entities/calculation/calculation.model';
import { CalculationService } from 'app/entities/calculation/service/calculation.service';
import { IOhlc } from 'app/entities/ohlc/ohlc.model';
import { OhlcService } from 'app/entities/ohlc/service/ohlc.service';

import { TupleUpdateComponent } from './tuple-update.component';

describe('Tuple Management Update Component', () => {
  let comp: TupleUpdateComponent;
  let fixture: ComponentFixture<TupleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tupleFormService: TupleFormService;
  let tupleService: TupleService;
  let calculationService: CalculationService;
  let ohlcService: OhlcService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TupleUpdateComponent],
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
      .overrideTemplate(TupleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TupleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tupleFormService = TestBed.inject(TupleFormService);
    tupleService = TestBed.inject(TupleService);
    calculationService = TestBed.inject(CalculationService);
    ohlcService = TestBed.inject(OhlcService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Calculation query and add missing value', () => {
      const tuple: ITuple = { id: 456 };
      const calculation: ICalculation = { id: 73297 };
      tuple.calculation = calculation;

      const calculationCollection: ICalculation[] = [{ id: 64097 }];
      jest.spyOn(calculationService, 'query').mockReturnValue(of(new HttpResponse({ body: calculationCollection })));
      const additionalCalculations = [calculation];
      const expectedCollection: ICalculation[] = [...additionalCalculations, ...calculationCollection];
      jest.spyOn(calculationService, 'addCalculationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tuple });
      comp.ngOnInit();

      expect(calculationService.query).toHaveBeenCalled();
      expect(calculationService.addCalculationToCollectionIfMissing).toHaveBeenCalledWith(
        calculationCollection,
        ...additionalCalculations.map(expect.objectContaining)
      );
      expect(comp.calculationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Ohlc query and add missing value', () => {
      const tuple: ITuple = { id: 456 };
      const ohlc: IOhlc = { id: 35293 };
      tuple.ohlc = ohlc;

      const ohlcCollection: IOhlc[] = [{ id: 47299 }];
      jest.spyOn(ohlcService, 'query').mockReturnValue(of(new HttpResponse({ body: ohlcCollection })));
      const additionalOhlcs = [ohlc];
      const expectedCollection: IOhlc[] = [...additionalOhlcs, ...ohlcCollection];
      jest.spyOn(ohlcService, 'addOhlcToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tuple });
      comp.ngOnInit();

      expect(ohlcService.query).toHaveBeenCalled();
      expect(ohlcService.addOhlcToCollectionIfMissing).toHaveBeenCalledWith(
        ohlcCollection,
        ...additionalOhlcs.map(expect.objectContaining)
      );
      expect(comp.ohlcsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const tuple: ITuple = { id: 456 };
      const calculation: ICalculation = { id: 43418 };
      tuple.calculation = calculation;
      const ohlc: IOhlc = { id: 94947 };
      tuple.ohlc = ohlc;

      activatedRoute.data = of({ tuple });
      comp.ngOnInit();

      expect(comp.calculationsSharedCollection).toContain(calculation);
      expect(comp.ohlcsSharedCollection).toContain(ohlc);
      expect(comp.tuple).toEqual(tuple);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITuple>>();
      const tuple = { id: 123 };
      jest.spyOn(tupleFormService, 'getTuple').mockReturnValue(tuple);
      jest.spyOn(tupleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tuple });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tuple }));
      saveSubject.complete();

      // THEN
      expect(tupleFormService.getTuple).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(tupleService.update).toHaveBeenCalledWith(expect.objectContaining(tuple));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITuple>>();
      const tuple = { id: 123 };
      jest.spyOn(tupleFormService, 'getTuple').mockReturnValue({ id: null });
      jest.spyOn(tupleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tuple: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tuple }));
      saveSubject.complete();

      // THEN
      expect(tupleFormService.getTuple).toHaveBeenCalled();
      expect(tupleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITuple>>();
      const tuple = { id: 123 };
      jest.spyOn(tupleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tuple });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tupleService.update).toHaveBeenCalled();
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
