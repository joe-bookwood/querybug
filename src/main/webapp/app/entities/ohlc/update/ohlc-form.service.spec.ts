import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../ohlc.test-samples';

import { OhlcFormService } from './ohlc-form.service';

describe('Ohlc Form Service', () => {
  let service: OhlcFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OhlcFormService);
  });

  describe('Service methods', () => {
    describe('createOhlcFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOhlcFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            time: expect.any(Object),
            open: expect.any(Object),
            high: expect.any(Object),
            low: expect.any(Object),
            close: expect.any(Object),
            volumeWeightedAveragePrice: expect.any(Object),
            volume: expect.any(Object),
            count: expect.any(Object),
            chart: expect.any(Object),
          })
        );
      });

      it('passing IOhlc should create a new form with FormGroup', () => {
        const formGroup = service.createOhlcFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            time: expect.any(Object),
            open: expect.any(Object),
            high: expect.any(Object),
            low: expect.any(Object),
            close: expect.any(Object),
            volumeWeightedAveragePrice: expect.any(Object),
            volume: expect.any(Object),
            count: expect.any(Object),
            chart: expect.any(Object),
          })
        );
      });
    });

    describe('getOhlc', () => {
      it('should return NewOhlc for default Ohlc initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOhlcFormGroup(sampleWithNewData);

        const ohlc = service.getOhlc(formGroup) as any;

        expect(ohlc).toMatchObject(sampleWithNewData);
      });

      it('should return NewOhlc for empty Ohlc initial value', () => {
        const formGroup = service.createOhlcFormGroup();

        const ohlc = service.getOhlc(formGroup) as any;

        expect(ohlc).toMatchObject({});
      });

      it('should return IOhlc', () => {
        const formGroup = service.createOhlcFormGroup(sampleWithRequiredData);

        const ohlc = service.getOhlc(formGroup) as any;

        expect(ohlc).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOhlc should not enable id FormControl', () => {
        const formGroup = service.createOhlcFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOhlc should disable id FormControl', () => {
        const formGroup = service.createOhlcFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
