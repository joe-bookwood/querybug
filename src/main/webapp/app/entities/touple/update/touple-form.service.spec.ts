import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../touple.test-samples';

import { ToupleFormService } from './touple-form.service';

describe('Touple Form Service', () => {
  let service: ToupleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToupleFormService);
  });

  describe('Service methods', () => {
    describe('createToupleFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createToupleFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            computation: expect.any(Object),
            time: expect.any(Object),
            calculation: expect.any(Object),
            ohlc: expect.any(Object),
          })
        );
      });

      it('passing ITouple should create a new form with FormGroup', () => {
        const formGroup = service.createToupleFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            computation: expect.any(Object),
            time: expect.any(Object),
            calculation: expect.any(Object),
            ohlc: expect.any(Object),
          })
        );
      });
    });

    describe('getTouple', () => {
      it('should return NewTouple for default Touple initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createToupleFormGroup(sampleWithNewData);

        const touple = service.getTouple(formGroup) as any;

        expect(touple).toMatchObject(sampleWithNewData);
      });

      it('should return NewTouple for empty Touple initial value', () => {
        const formGroup = service.createToupleFormGroup();

        const touple = service.getTouple(formGroup) as any;

        expect(touple).toMatchObject({});
      });

      it('should return ITouple', () => {
        const formGroup = service.createToupleFormGroup(sampleWithRequiredData);

        const touple = service.getTouple(formGroup) as any;

        expect(touple).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITouple should not enable id FormControl', () => {
        const formGroup = service.createToupleFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTouple should disable id FormControl', () => {
        const formGroup = service.createToupleFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
