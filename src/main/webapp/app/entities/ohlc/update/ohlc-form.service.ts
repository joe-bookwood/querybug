import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOhlc, NewOhlc } from '../ohlc.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOhlc for edit and NewOhlcFormGroupInput for create.
 */
type OhlcFormGroupInput = IOhlc | PartialWithRequiredKeyOf<NewOhlc>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IOhlc | NewOhlc> = Omit<T, 'time'> & {
  time?: string | null;
};

type OhlcFormRawValue = FormValueOf<IOhlc>;

type NewOhlcFormRawValue = FormValueOf<NewOhlc>;

type OhlcFormDefaults = Pick<NewOhlc, 'id' | 'time'>;

type OhlcFormGroupContent = {
  id: FormControl<OhlcFormRawValue['id'] | NewOhlc['id']>;
  time: FormControl<OhlcFormRawValue['time']>;
  open: FormControl<OhlcFormRawValue['open']>;
  high: FormControl<OhlcFormRawValue['high']>;
  low: FormControl<OhlcFormRawValue['low']>;
  close: FormControl<OhlcFormRawValue['close']>;
  volumeWeightedAveragePrice: FormControl<OhlcFormRawValue['volumeWeightedAveragePrice']>;
  volume: FormControl<OhlcFormRawValue['volume']>;
  count: FormControl<OhlcFormRawValue['count']>;
  chart: FormControl<OhlcFormRawValue['chart']>;
};

export type OhlcFormGroup = FormGroup<OhlcFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OhlcFormService {
  createOhlcFormGroup(ohlc: OhlcFormGroupInput = { id: null }): OhlcFormGroup {
    const ohlcRawValue = this.convertOhlcToOhlcRawValue({
      ...this.getFormDefaults(),
      ...ohlc,
    });
    return new FormGroup<OhlcFormGroupContent>({
      id: new FormControl(
        { value: ohlcRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      time: new FormControl(ohlcRawValue.time),
      open: new FormControl(ohlcRawValue.open),
      high: new FormControl(ohlcRawValue.high),
      low: new FormControl(ohlcRawValue.low),
      close: new FormControl(ohlcRawValue.close),
      volumeWeightedAveragePrice: new FormControl(ohlcRawValue.volumeWeightedAveragePrice),
      volume: new FormControl(ohlcRawValue.volume),
      count: new FormControl(ohlcRawValue.count),
      chart: new FormControl(ohlcRawValue.chart, {
        validators: [Validators.required],
      }),
    });
  }

  getOhlc(form: OhlcFormGroup): IOhlc | NewOhlc {
    return this.convertOhlcRawValueToOhlc(form.getRawValue() as OhlcFormRawValue | NewOhlcFormRawValue);
  }

  resetForm(form: OhlcFormGroup, ohlc: OhlcFormGroupInput): void {
    const ohlcRawValue = this.convertOhlcToOhlcRawValue({ ...this.getFormDefaults(), ...ohlc });
    form.reset(
      {
        ...ohlcRawValue,
        id: { value: ohlcRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OhlcFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      time: currentTime,
    };
  }

  private convertOhlcRawValueToOhlc(rawOhlc: OhlcFormRawValue | NewOhlcFormRawValue): IOhlc | NewOhlc {
    return {
      ...rawOhlc,
      time: dayjs(rawOhlc.time, DATE_TIME_FORMAT),
    };
  }

  private convertOhlcToOhlcRawValue(
    ohlc: IOhlc | (Partial<NewOhlc> & OhlcFormDefaults)
  ): OhlcFormRawValue | PartialWithRequiredKeyOf<NewOhlcFormRawValue> {
    return {
      ...ohlc,
      time: ohlc.time ? ohlc.time.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
