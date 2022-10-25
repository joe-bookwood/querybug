import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FeeFormService } from './fee-form.service';
import { FeeService } from '../service/fee.service';
import { IFee } from '../fee.model';
import { IPair } from 'app/entities/pair/pair.model';
import { PairService } from 'app/entities/pair/service/pair.service';

import { FeeUpdateComponent } from './fee-update.component';

describe('Fee Management Update Component', () => {
  let comp: FeeUpdateComponent;
  let fixture: ComponentFixture<FeeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let feeFormService: FeeFormService;
  let feeService: FeeService;
  let pairService: PairService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FeeUpdateComponent],
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
      .overrideTemplate(FeeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FeeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    feeFormService = TestBed.inject(FeeFormService);
    feeService = TestBed.inject(FeeService);
    pairService = TestBed.inject(PairService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Pair query and add missing value', () => {
      const fee: IFee = { id: 456 };
      const pair: IPair = { id: 32984 };
      fee.pair = pair;

      const pairCollection: IPair[] = [{ id: 11705 }];
      jest.spyOn(pairService, 'query').mockReturnValue(of(new HttpResponse({ body: pairCollection })));
      const additionalPairs = [pair];
      const expectedCollection: IPair[] = [...additionalPairs, ...pairCollection];
      jest.spyOn(pairService, 'addPairToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ fee });
      comp.ngOnInit();

      expect(pairService.query).toHaveBeenCalled();
      expect(pairService.addPairToCollectionIfMissing).toHaveBeenCalledWith(
        pairCollection,
        ...additionalPairs.map(expect.objectContaining)
      );
      expect(comp.pairsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const fee: IFee = { id: 456 };
      const pair: IPair = { id: 69300 };
      fee.pair = pair;

      activatedRoute.data = of({ fee });
      comp.ngOnInit();

      expect(comp.pairsSharedCollection).toContain(pair);
      expect(comp.fee).toEqual(fee);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFee>>();
      const fee = { id: 123 };
      jest.spyOn(feeFormService, 'getFee').mockReturnValue(fee);
      jest.spyOn(feeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fee }));
      saveSubject.complete();

      // THEN
      expect(feeFormService.getFee).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(feeService.update).toHaveBeenCalledWith(expect.objectContaining(fee));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFee>>();
      const fee = { id: 123 };
      jest.spyOn(feeFormService, 'getFee').mockReturnValue({ id: null });
      jest.spyOn(feeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fee: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fee }));
      saveSubject.complete();

      // THEN
      expect(feeFormService.getFee).toHaveBeenCalled();
      expect(feeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFee>>();
      const fee = { id: 123 };
      jest.spyOn(feeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(feeService.update).toHaveBeenCalled();
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
  });
});
