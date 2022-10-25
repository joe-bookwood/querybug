import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../calculation.test-samples';

import { CalculationFormService } from './calculation-form.service';

describe('Calculation Form Service', () => {
  let service: CalculationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculationFormService);
  });

  describe('Service methods', () => {
    describe('createCalculationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCalculationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            last: expect.any(Object),
            disabled: expect.any(Object),
            chart: expect.any(Object),
          })
        );
      });

      it('passing ICalculation should create a new form with FormGroup', () => {
        const formGroup = service.createCalculationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            last: expect.any(Object),
            disabled: expect.any(Object),
            chart: expect.any(Object),
          })
        );
      });
    });

    describe('getCalculation', () => {
      it('should return NewCalculation for default Calculation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCalculationFormGroup(sampleWithNewData);

        const calculation = service.getCalculation(formGroup) as any;

        expect(calculation).toMatchObject(sampleWithNewData);
      });

      it('should return NewCalculation for empty Calculation initial value', () => {
        const formGroup = service.createCalculationFormGroup();

        const calculation = service.getCalculation(formGroup) as any;

        expect(calculation).toMatchObject({});
      });

      it('should return ICalculation', () => {
        const formGroup = service.createCalculationFormGroup(sampleWithRequiredData);

        const calculation = service.getCalculation(formGroup) as any;

        expect(calculation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICalculation should not enable id FormControl', () => {
        const formGroup = service.createCalculationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCalculation should disable id FormControl', () => {
        const formGroup = service.createCalculationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
