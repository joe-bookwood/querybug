import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAsset, NewAsset } from '../asset.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAsset for edit and NewAssetFormGroupInput for create.
 */
type AssetFormGroupInput = IAsset | PartialWithRequiredKeyOf<NewAsset>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAsset | NewAsset> = Omit<T, 'lastChecked'> & {
  lastChecked?: string | null;
};

type AssetFormRawValue = FormValueOf<IAsset>;

type NewAssetFormRawValue = FormValueOf<NewAsset>;

type AssetFormDefaults = Pick<NewAsset, 'id' | 'lastChecked'>;

type AssetFormGroupContent = {
  id: FormControl<AssetFormRawValue['id'] | NewAsset['id']>;
  name: FormControl<AssetFormRawValue['name']>;
  assetClass: FormControl<AssetFormRawValue['assetClass']>;
  alternativeName: FormControl<AssetFormRawValue['alternativeName']>;
  decimals: FormControl<AssetFormRawValue['decimals']>;
  displayDecimals: FormControl<AssetFormRawValue['displayDecimals']>;
  lastChecked: FormControl<AssetFormRawValue['lastChecked']>;
};

export type AssetFormGroup = FormGroup<AssetFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AssetFormService {
  createAssetFormGroup(asset: AssetFormGroupInput = { id: null }): AssetFormGroup {
    const assetRawValue = this.convertAssetToAssetRawValue({
      ...this.getFormDefaults(),
      ...asset,
    });
    return new FormGroup<AssetFormGroupContent>({
      id: new FormControl(
        { value: assetRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(assetRawValue.name),
      assetClass: new FormControl(assetRawValue.assetClass),
      alternativeName: new FormControl(assetRawValue.alternativeName),
      decimals: new FormControl(assetRawValue.decimals),
      displayDecimals: new FormControl(assetRawValue.displayDecimals),
      lastChecked: new FormControl(assetRawValue.lastChecked),
    });
  }

  getAsset(form: AssetFormGroup): IAsset | NewAsset {
    return this.convertAssetRawValueToAsset(form.getRawValue() as AssetFormRawValue | NewAssetFormRawValue);
  }

  resetForm(form: AssetFormGroup, asset: AssetFormGroupInput): void {
    const assetRawValue = this.convertAssetToAssetRawValue({ ...this.getFormDefaults(), ...asset });
    form.reset(
      {
        ...assetRawValue,
        id: { value: assetRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AssetFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      lastChecked: currentTime,
    };
  }

  private convertAssetRawValueToAsset(rawAsset: AssetFormRawValue | NewAssetFormRawValue): IAsset | NewAsset {
    return {
      ...rawAsset,
      lastChecked: dayjs(rawAsset.lastChecked, DATE_TIME_FORMAT),
    };
  }

  private convertAssetToAssetRawValue(
    asset: IAsset | (Partial<NewAsset> & AssetFormDefaults)
  ): AssetFormRawValue | PartialWithRequiredKeyOf<NewAssetFormRawValue> {
    return {
      ...asset,
      lastChecked: asset.lastChecked ? asset.lastChecked.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
