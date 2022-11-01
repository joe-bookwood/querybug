import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPair, NewPair } from '../pair.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPair for edit and NewPairFormGroupInput for create.
 */
type PairFormGroupInput = IPair | PartialWithRequiredKeyOf<NewPair>;

type PairFormDefaults = Pick<NewPair, 'id'>;

type PairFormGroupContent = {
  id: FormControl<IPair['id'] | NewPair['id']>;
  name: FormControl<IPair['name']>;
  altname: FormControl<IPair['altname']>;
  webSocketPairName: FormControl<IPair['webSocketPairName']>;
  lot: FormControl<IPair['lot']>;
  pairDecimal: FormControl<IPair['pairDecimal']>;
  lotDecimals: FormControl<IPair['lotDecimals']>;
  lotMultiplier: FormControl<IPair['lotMultiplier']>;
  base: FormControl<IPair['base']>;
  quote: FormControl<IPair['quote']>;
};

export type PairFormGroup = FormGroup<PairFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PairFormService {
  createPairFormGroup(pair: PairFormGroupInput = { id: null }): PairFormGroup {
    const pairRawValue = {
      ...this.getFormDefaults(),
      ...pair,
    };
    return new FormGroup<PairFormGroupContent>({
      id: new FormControl(
        { value: pairRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(pairRawValue.name),
      altname: new FormControl(pairRawValue.altname),
      webSocketPairName: new FormControl(pairRawValue.webSocketPairName),
      lot: new FormControl(pairRawValue.lot),
      pairDecimal: new FormControl(pairRawValue.pairDecimal),
      lotDecimals: new FormControl(pairRawValue.lotDecimals),
      lotMultiplier: new FormControl(pairRawValue.lotMultiplier),
      base: new FormControl(pairRawValue.base, {
        validators: [Validators.required],
      }),
      quote: new FormControl(pairRawValue.quote, {
        validators: [Validators.required],
      }),
    });
  }

  getPair(form: PairFormGroup): IPair | NewPair {
    return form.getRawValue() as IPair | NewPair;
  }

  resetForm(form: PairFormGroup, pair: PairFormGroupInput): void {
    const pairRawValue = { ...this.getFormDefaults(), ...pair };
    form.reset(
      {
        ...pairRawValue,
        id: { value: pairRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PairFormDefaults {
    return {
      id: null,
    };
  }
}
