import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../pair.test-samples';

import { PairFormService } from './pair-form.service';

describe('Pair Form Service', () => {
  let service: PairFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PairFormService);
  });

  describe('Service methods', () => {
    describe('createPairFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPairFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            altname: expect.any(Object),
            webSocketPairName: expect.any(Object),
            lot: expect.any(Object),
            pairDecimal: expect.any(Object),
            lotDecimals: expect.any(Object),
            lotMultiplier: expect.any(Object),
            base: expect.any(Object),
            quote: expect.any(Object),
          })
        );
      });

      it('passing IPair should create a new form with FormGroup', () => {
        const formGroup = service.createPairFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            altname: expect.any(Object),
            webSocketPairName: expect.any(Object),
            lot: expect.any(Object),
            pairDecimal: expect.any(Object),
            lotDecimals: expect.any(Object),
            lotMultiplier: expect.any(Object),
            base: expect.any(Object),
            quote: expect.any(Object),
          })
        );
      });
    });

    describe('getPair', () => {
      it('should return NewPair for default Pair initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPairFormGroup(sampleWithNewData);

        const pair = service.getPair(formGroup) as any;

        expect(pair).toMatchObject(sampleWithNewData);
      });

      it('should return NewPair for empty Pair initial value', () => {
        const formGroup = service.createPairFormGroup();

        const pair = service.getPair(formGroup) as any;

        expect(pair).toMatchObject({});
      });

      it('should return IPair', () => {
        const formGroup = service.createPairFormGroup(sampleWithRequiredData);

        const pair = service.getPair(formGroup) as any;

        expect(pair).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPair should not enable id FormControl', () => {
        const formGroup = service.createPairFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPair should disable id FormControl', () => {
        const formGroup = service.createPairFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
