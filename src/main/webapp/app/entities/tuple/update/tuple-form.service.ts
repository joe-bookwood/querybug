import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITuple, NewTuple } from '../tuple.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITuple for edit and NewTupleFormGroupInput for create.
 */
type TupleFormGroupInput = ITuple | PartialWithRequiredKeyOf<NewTuple>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITuple | NewTuple> = Omit<T, 'time'> & {
  time?: string | null;
};

type TupleFormRawValue = FormValueOf<ITuple>;

type NewTupleFormRawValue = FormValueOf<NewTuple>;

type TupleFormDefaults = Pick<NewTuple, 'id' | 'time'>;

type TupleFormGroupContent = {
  id: FormControl<TupleFormRawValue['id'] | NewTuple['id']>;
  computation: FormControl<TupleFormRawValue['computation']>;
  time: FormControl<TupleFormRawValue['time']>;
  calculation: FormControl<TupleFormRawValue['calculation']>;
  ohlc: FormControl<TupleFormRawValue['ohlc']>;
};

export type TupleFormGroup = FormGroup<TupleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TupleFormService {
  createTupleFormGroup(tuple: TupleFormGroupInput = { id: null }): TupleFormGroup {
    const tupleRawValue = this.convertTupleToTupleRawValue({
      ...this.getFormDefaults(),
      ...tuple,
    });
    return new FormGroup<TupleFormGroupContent>({
      id: new FormControl(
        { value: tupleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      computation: new FormControl(tupleRawValue.computation),
      time: new FormControl(tupleRawValue.time),
      calculation: new FormControl(tupleRawValue.calculation),
      ohlc: new FormControl(tupleRawValue.ohlc),
    });
  }

  getTuple(form: TupleFormGroup): ITuple | NewTuple {
    return this.convertTupleRawValueToTuple(form.getRawValue() as TupleFormRawValue | NewTupleFormRawValue);
  }

  resetForm(form: TupleFormGroup, tuple: TupleFormGroupInput): void {
    const tupleRawValue = this.convertTupleToTupleRawValue({ ...this.getFormDefaults(), ...tuple });
    form.reset(
      {
        ...tupleRawValue,
        id: { value: tupleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TupleFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      time: currentTime,
    };
  }

  private convertTupleRawValueToTuple(rawTuple: TupleFormRawValue | NewTupleFormRawValue): ITuple | NewTuple {
    return {
      ...rawTuple,
      time: dayjs(rawTuple.time, DATE_TIME_FORMAT),
    };
  }

  private convertTupleToTupleRawValue(
    tuple: ITuple | (Partial<NewTuple> & TupleFormDefaults)
  ): TupleFormRawValue | PartialWithRequiredKeyOf<NewTupleFormRawValue> {
    return {
      ...tuple,
      time: tuple.time ? tuple.time.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
