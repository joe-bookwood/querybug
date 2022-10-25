import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../chart.test-samples';

import { ChartFormService } from './chart-form.service';

describe('Chart Form Service', () => {
  let service: ChartFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartFormService);
  });

  describe('Service methods', () => {
    describe('createChartFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createChartFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            last: expect.any(Object),
            maxCount: expect.any(Object),
            disabled: expect.any(Object),
            pair: expect.any(Object),
            timeRange: expect.any(Object),
          })
        );
      });

      it('passing IChart should create a new form with FormGroup', () => {
        const formGroup = service.createChartFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            last: expect.any(Object),
            maxCount: expect.any(Object),
            disabled: expect.any(Object),
            pair: expect.any(Object),
            timeRange: expect.any(Object),
          })
        );
      });
    });

    describe('getChart', () => {
      it('should return NewChart for default Chart initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createChartFormGroup(sampleWithNewData);

        const chart = service.getChart(formGroup) as any;

        expect(chart).toMatchObject(sampleWithNewData);
      });

      it('should return NewChart for empty Chart initial value', () => {
        const formGroup = service.createChartFormGroup();

        const chart = service.getChart(formGroup) as any;

        expect(chart).toMatchObject({});
      });

      it('should return IChart', () => {
        const formGroup = service.createChartFormGroup(sampleWithRequiredData);

        const chart = service.getChart(formGroup) as any;

        expect(chart).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IChart should not enable id FormControl', () => {
        const formGroup = service.createChartFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewChart should disable id FormControl', () => {
        const formGroup = service.createChartFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
