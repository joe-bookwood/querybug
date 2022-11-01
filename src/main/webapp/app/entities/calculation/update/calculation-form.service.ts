import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICalculation, NewCalculation } from '../calculation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICalculation for edit and NewCalculationFormGroupInput for create.
 */
type CalculationFormGroupInput = ICalculation | PartialWithRequiredKeyOf<NewCalculation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICalculation | NewCalculation> = Omit<T, 'last'> & {
  last?: string | null;
};

type CalculationFormRawValue = FormValueOf<ICalculation>;

type NewCalculationFormRawValue = FormValueOf<NewCalculation>;

type CalculationFormDefaults = Pick<NewCalculation, 'id' | 'last' | 'disabled'>;

type CalculationFormGroupContent = {
  id: FormControl<CalculationFormRawValue['id'] | NewCalculation['id']>;
  name: FormControl<CalculationFormRawValue['name']>;
  last: FormControl<CalculationFormRawValue['last']>;
  disabled: FormControl<CalculationFormRawValue['disabled']>;
  chart: FormControl<CalculationFormRawValue['chart']>;
};

export type CalculationFormGroup = FormGroup<CalculationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CalculationFormService {
  createCalculationFormGroup(calculation: CalculationFormGroupInput = { id: null }): CalculationFormGroup {
    const calculationRawValue = this.convertCalculationToCalculationRawValue({
      ...this.getFormDefaults(),
      ...calculation,
    });
    return new FormGroup<CalculationFormGroupContent>({
      id: new FormControl(
        { value: calculationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(calculationRawValue.name),
      last: new FormControl(calculationRawValue.last),
      disabled: new FormControl(calculationRawValue.disabled),
      chart: new FormControl(calculationRawValue.chart, {
        validators: [Validators.required],
      }),
    });
  }

  getCalculation(form: CalculationFormGroup): ICalculation | NewCalculation {
    return this.convertCalculationRawValueToCalculation(form.getRawValue() as CalculationFormRawValue | NewCalculationFormRawValue);
  }

  resetForm(form: CalculationFormGroup, calculation: CalculationFormGroupInput): void {
    const calculationRawValue = this.convertCalculationToCalculationRawValue({ ...this.getFormDefaults(), ...calculation });
    form.reset(
      {
        ...calculationRawValue,
        id: { value: calculationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CalculationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      last: currentTime,
      disabled: false,
    };
  }

  private convertCalculationRawValueToCalculation(
    rawCalculation: CalculationFormRawValue | NewCalculationFormRawValue
  ): ICalculation | NewCalculation {
    return {
      ...rawCalculation,
      last: dayjs(rawCalculation.last, DATE_TIME_FORMAT),
    };
  }

  private convertCalculationToCalculationRawValue(
    calculation: ICalculation | (Partial<NewCalculation> & CalculationFormDefaults)
  ): CalculationFormRawValue | PartialWithRequiredKeyOf<NewCalculationFormRawValue> {
    return {
      ...calculation,
      last: calculation.last ? calculation.last.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
