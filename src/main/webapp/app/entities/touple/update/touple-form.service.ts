import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITouple, NewTouple } from '../touple.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITouple for edit and NewToupleFormGroupInput for create.
 */
type ToupleFormGroupInput = ITouple | PartialWithRequiredKeyOf<NewTouple>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITouple | NewTouple> = Omit<T, 'time'> & {
  time?: string | null;
};

type ToupleFormRawValue = FormValueOf<ITouple>;

type NewToupleFormRawValue = FormValueOf<NewTouple>;

type ToupleFormDefaults = Pick<NewTouple, 'id' | 'time'>;

type ToupleFormGroupContent = {
  id: FormControl<ToupleFormRawValue['id'] | NewTouple['id']>;
  computation: FormControl<ToupleFormRawValue['computation']>;
  time: FormControl<ToupleFormRawValue['time']>;
  calculation: FormControl<ToupleFormRawValue['calculation']>;
  ohlc: FormControl<ToupleFormRawValue['ohlc']>;
};

export type ToupleFormGroup = FormGroup<ToupleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ToupleFormService {
  createToupleFormGroup(touple: ToupleFormGroupInput = { id: null }): ToupleFormGroup {
    const toupleRawValue = this.convertToupleToToupleRawValue({
      ...this.getFormDefaults(),
      ...touple,
    });
    return new FormGroup<ToupleFormGroupContent>({
      id: new FormControl(
        { value: toupleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      computation: new FormControl(toupleRawValue.computation),
      time: new FormControl(toupleRawValue.time),
      calculation: new FormControl(toupleRawValue.calculation),
      ohlc: new FormControl(toupleRawValue.ohlc),
    });
  }

  getTouple(form: ToupleFormGroup): ITouple | NewTouple {
    return this.convertToupleRawValueToTouple(form.getRawValue() as ToupleFormRawValue | NewToupleFormRawValue);
  }

  resetForm(form: ToupleFormGroup, touple: ToupleFormGroupInput): void {
    const toupleRawValue = this.convertToupleToToupleRawValue({ ...this.getFormDefaults(), ...touple });
    form.reset(
      {
        ...toupleRawValue,
        id: { value: toupleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ToupleFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      time: currentTime,
    };
  }

  private convertToupleRawValueToTouple(rawTouple: ToupleFormRawValue | NewToupleFormRawValue): ITouple | NewTouple {
    return {
      ...rawTouple,
      time: dayjs(rawTouple.time, DATE_TIME_FORMAT),
    };
  }

  private convertToupleToToupleRawValue(
    touple: ITouple | (Partial<NewTouple> & ToupleFormDefaults)
  ): ToupleFormRawValue | PartialWithRequiredKeyOf<NewToupleFormRawValue> {
    return {
      ...touple,
      time: touple.time ? touple.time.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
