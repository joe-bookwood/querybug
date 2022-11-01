import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PairFormService } from './pair-form.service';
import { PairService } from '../service/pair.service';
import { IPair } from '../pair.model';
import { IAsset } from 'app/entities/asset/asset.model';
import { AssetService } from 'app/entities/asset/service/asset.service';

import { PairUpdateComponent } from './pair-update.component';

describe('Pair Management Update Component', () => {
  let comp: PairUpdateComponent;
  let fixture: ComponentFixture<PairUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pairFormService: PairFormService;
  let pairService: PairService;
  let assetService: AssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PairUpdateComponent],
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
      .overrideTemplate(PairUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PairUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pairFormService = TestBed.inject(PairFormService);
    pairService = TestBed.inject(PairService);
    assetService = TestBed.inject(AssetService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Asset query and add missing value', () => {
      const pair: IPair = { id: 456 };
      const base: IAsset = { id: 40734 };
      pair.base = base;
      const quote: IAsset = { id: 16128 };
      pair.quote = quote;

      const assetCollection: IAsset[] = [{ id: 7655 }];
      jest.spyOn(assetService, 'query').mockReturnValue(of(new HttpResponse({ body: assetCollection })));
      const additionalAssets = [base, quote];
      const expectedCollection: IAsset[] = [...additionalAssets, ...assetCollection];
      jest.spyOn(assetService, 'addAssetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pair });
      comp.ngOnInit();

      expect(assetService.query).toHaveBeenCalled();
      expect(assetService.addAssetToCollectionIfMissing).toHaveBeenCalledWith(
        assetCollection,
        ...additionalAssets.map(expect.objectContaining)
      );
      expect(comp.assetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pair: IPair = { id: 456 };
      const base: IAsset = { id: 66297 };
      pair.base = base;
      const quote: IAsset = { id: 19175 };
      pair.quote = quote;

      activatedRoute.data = of({ pair });
      comp.ngOnInit();

      expect(comp.assetsSharedCollection).toContain(base);
      expect(comp.assetsSharedCollection).toContain(quote);
      expect(comp.pair).toEqual(pair);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPair>>();
      const pair = { id: 123 };
      jest.spyOn(pairFormService, 'getPair').mockReturnValue(pair);
      jest.spyOn(pairService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pair });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pair }));
      saveSubject.complete();

      // THEN
      expect(pairFormService.getPair).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pairService.update).toHaveBeenCalledWith(expect.objectContaining(pair));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPair>>();
      const pair = { id: 123 };
      jest.spyOn(pairFormService, 'getPair').mockReturnValue({ id: null });
      jest.spyOn(pairService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pair: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pair }));
      saveSubject.complete();

      // THEN
      expect(pairFormService.getPair).toHaveBeenCalled();
      expect(pairService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPair>>();
      const pair = { id: 123 };
      jest.spyOn(pairService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pair });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pairService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAsset', () => {
      it('Should forward to assetService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(assetService, 'compareAsset');
        comp.compareAsset(entity, entity2);
        expect(assetService.compareAsset).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
