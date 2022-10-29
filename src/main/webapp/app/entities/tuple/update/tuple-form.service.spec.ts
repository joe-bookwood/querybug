import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../tuple.test-samples';

import { TupleFormService } from './tuple-form.service';

describe('Tuple Form Service', () => {
  let service: TupleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TupleFormService);
  });

  describe('Service methods', () => {
    describe('createTupleFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTupleFormGroup();

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

      it('passing ITuple should create a new form with FormGroup', () => {
        const formGroup = service.createTupleFormGroup(sampleWithRequiredData);

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

    describe('getTuple', () => {
      it('should return NewTuple for default Tuple initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTupleFormGroup(sampleWithNewData);

        const tuple = service.getTuple(formGroup) as any;

        expect(tuple).toMatchObject(sampleWithNewData);
      });

      it('should return NewTuple for empty Tuple initial value', () => {
        const formGroup = service.createTupleFormGroup();

        const tuple = service.getTuple(formGroup) as any;

        expect(tuple).toMatchObject({});
      });

      it('should return ITuple', () => {
        const formGroup = service.createTupleFormGroup(sampleWithRequiredData);

        const tuple = service.getTuple(formGroup) as any;

        expect(tuple).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITuple should not enable id FormControl', () => {
        const formGroup = service.createTupleFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTuple should disable id FormControl', () => {
        const formGroup = service.createTupleFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
