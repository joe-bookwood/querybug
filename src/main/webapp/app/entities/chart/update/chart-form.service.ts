import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IChart, NewChart } from '../chart.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChart for edit and NewChartFormGroupInput for create.
 */
type ChartFormGroupInput = IChart | PartialWithRequiredKeyOf<NewChart>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IChart | NewChart> = Omit<T, 'last'> & {
  last?: string | null;
};

type ChartFormRawValue = FormValueOf<IChart>;

type NewChartFormRawValue = FormValueOf<NewChart>;

type ChartFormDefaults = Pick<NewChart, 'id' | 'last' | 'disabled'>;

type ChartFormGroupContent = {
  id: FormControl<ChartFormRawValue['id'] | NewChart['id']>;
  name: FormControl<ChartFormRawValue['name']>;
  last: FormControl<ChartFormRawValue['last']>;
  maxCount: FormControl<ChartFormRawValue['maxCount']>;
  disabled: FormControl<ChartFormRawValue['disabled']>;
  pair: FormControl<ChartFormRawValue['pair']>;
  timeRange: FormControl<ChartFormRawValue['timeRange']>;
};

export type ChartFormGroup = FormGroup<ChartFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChartFormService {
  createChartFormGroup(chart: ChartFormGroupInput = { id: null }): ChartFormGroup {
    const chartRawValue = this.convertChartToChartRawValue({
      ...this.getFormDefaults(),
      ...chart,
    });
    return new FormGroup<ChartFormGroupContent>({
      id: new FormControl(
        { value: chartRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(chartRawValue.name),
      last: new FormControl(chartRawValue.last),
      maxCount: new FormControl(chartRawValue.maxCount),
      disabled: new FormControl(chartRawValue.disabled),
      pair: new FormControl(chartRawValue.pair, {
        validators: [Validators.required],
      }),
      timeRange: new FormControl(chartRawValue.timeRange, {
        validators: [Validators.required],
      }),
    });
  }

  getChart(form: ChartFormGroup): IChart | NewChart {
    return this.convertChartRawValueToChart(form.getRawValue() as ChartFormRawValue | NewChartFormRawValue);
  }

  resetForm(form: ChartFormGroup, chart: ChartFormGroupInput): void {
    const chartRawValue = this.convertChartToChartRawValue({ ...this.getFormDefaults(), ...chart });
    form.reset(
      {
        ...chartRawValue,
        id: { value: chartRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ChartFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      last: currentTime,
      disabled: false,
    };
  }

  private convertChartRawValueToChart(rawChart: ChartFormRawValue | NewChartFormRawValue): IChart | NewChart {
    return {
      ...rawChart,
      last: dayjs(rawChart.last, DATE_TIME_FORMAT),
    };
  }

  private convertChartToChartRawValue(
    chart: IChart | (Partial<NewChart> & ChartFormDefaults)
  ): ChartFormRawValue | PartialWithRequiredKeyOf<NewChartFormRawValue> {
    return {
      ...chart,
      last: chart.last ? chart.last.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
