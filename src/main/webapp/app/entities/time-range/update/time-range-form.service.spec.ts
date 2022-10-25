import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../time-range.test-samples';

import { TimeRangeFormService } from './time-range-form.service';

describe('TimeRange Form Service', () => {
  let service: TimeRangeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeRangeFormService);
  });

  describe('Service methods', () => {
    describe('createTimeRangeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTimeRangeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            rangeSize: expect.any(Object),
            duration: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });

      it('passing ITimeRange should create a new form with FormGroup', () => {
        const formGroup = service.createTimeRangeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            rangeSize: expect.any(Object),
            duration: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });
    });

    describe('getTimeRange', () => {
      it('should return NewTimeRange for default TimeRange initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTimeRangeFormGroup(sampleWithNewData);

        const timeRange = service.getTimeRange(formGroup) as any;

        expect(timeRange).toMatchObject(sampleWithNewData);
      });

      it('should return NewTimeRange for empty TimeRange initial value', () => {
        const formGroup = service.createTimeRangeFormGroup();

        const timeRange = service.getTimeRange(formGroup) as any;

        expect(timeRange).toMatchObject({});
      });

      it('should return ITimeRange', () => {
        const formGroup = service.createTimeRangeFormGroup(sampleWithRequiredData);

        const timeRange = service.getTimeRange(formGroup) as any;

        expect(timeRange).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITimeRange should not enable id FormControl', () => {
        const formGroup = service.createTimeRangeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTimeRange should disable id FormControl', () => {
        const formGroup = service.createTimeRangeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
