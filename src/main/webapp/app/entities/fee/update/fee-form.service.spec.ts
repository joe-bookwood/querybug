import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../fee.test-samples';

import { FeeFormService } from './fee-form.service';

describe('Fee Form Service', () => {
  let service: FeeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeeFormService);
  });

  describe('Service methods', () => {
    describe('createFeeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFeeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            volume: expect.any(Object),
            percent: expect.any(Object),
            pair: expect.any(Object),
          })
        );
      });

      it('passing IFee should create a new form with FormGroup', () => {
        const formGroup = service.createFeeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            volume: expect.any(Object),
            percent: expect.any(Object),
            pair: expect.any(Object),
          })
        );
      });
    });

    describe('getFee', () => {
      it('should return NewFee for default Fee initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFeeFormGroup(sampleWithNewData);

        const fee = service.getFee(formGroup) as any;

        expect(fee).toMatchObject(sampleWithNewData);
      });

      it('should return NewFee for empty Fee initial value', () => {
        const formGroup = service.createFeeFormGroup();

        const fee = service.getFee(formGroup) as any;

        expect(fee).toMatchObject({});
      });

      it('should return IFee', () => {
        const formGroup = service.createFeeFormGroup(sampleWithRequiredData);

        const fee = service.getFee(formGroup) as any;

        expect(fee).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFee should not enable id FormControl', () => {
        const formGroup = service.createFeeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFee should disable id FormControl', () => {
        const formGroup = service.createFeeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
