import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFee, NewFee } from '../fee.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFee for edit and NewFeeFormGroupInput for create.
 */
type FeeFormGroupInput = IFee | PartialWithRequiredKeyOf<NewFee>;

type FeeFormDefaults = Pick<NewFee, 'id'>;

type FeeFormGroupContent = {
  id: FormControl<IFee['id'] | NewFee['id']>;
  volume: FormControl<IFee['volume']>;
  percent: FormControl<IFee['percent']>;
  pair: FormControl<IFee['pair']>;
};

export type FeeFormGroup = FormGroup<FeeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FeeFormService {
  createFeeFormGroup(fee: FeeFormGroupInput = { id: null }): FeeFormGroup {
    const feeRawValue = {
      ...this.getFormDefaults(),
      ...fee,
    };
    return new FormGroup<FeeFormGroupContent>({
      id: new FormControl(
        { value: feeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      volume: new FormControl(feeRawValue.volume),
      percent: new FormControl(feeRawValue.percent),
      pair: new FormControl(feeRawValue.pair),
    });
  }

  getFee(form: FeeFormGroup): IFee | NewFee {
    return form.getRawValue() as IFee | NewFee;
  }

  resetForm(form: FeeFormGroup, fee: FeeFormGroupInput): void {
    const feeRawValue = { ...this.getFormDefaults(), ...fee };
    form.reset(
      {
        ...feeRawValue,
        id: { value: feeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FeeFormDefaults {
    return {
      id: null,
    };
  }
}
