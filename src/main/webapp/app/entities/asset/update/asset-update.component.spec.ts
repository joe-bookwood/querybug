import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AssetFormService } from './asset-form.service';
import { AssetService } from '../service/asset.service';
import { IAsset } from '../asset.model';

import { AssetUpdateComponent } from './asset-update.component';

describe('Asset Management Update Component', () => {
  let comp: AssetUpdateComponent;
  let fixture: ComponentFixture<AssetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let assetFormService: AssetFormService;
  let assetService: AssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AssetUpdateComponent],
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
      .overrideTemplate(AssetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AssetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    assetFormService = TestBed.inject(AssetFormService);
    assetService = TestBed.inject(AssetService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const asset: IAsset = { id: 456 };

      activatedRoute.data = of({ asset });
      comp.ngOnInit();

      expect(comp.asset).toEqual(asset);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAsset>>();
      const asset = { id: 123 };
      jest.spyOn(assetFormService, 'getAsset').mockReturnValue(asset);
      jest.spyOn(assetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asset });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: asset }));
      saveSubject.complete();

      // THEN
      expect(assetFormService.getAsset).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(assetService.update).toHaveBeenCalledWith(expect.objectContaining(asset));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAsset>>();
      const asset = { id: 123 };
      jest.spyOn(assetFormService, 'getAsset').mockReturnValue({ id: null });
      jest.spyOn(assetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asset: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: asset }));
      saveSubject.complete();

      // THEN
      expect(assetFormService.getAsset).toHaveBeenCalled();
      expect(assetService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAsset>>();
      const asset = { id: 123 };
      jest.spyOn(assetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asset });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(assetService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
