import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITimeRange, NewTimeRange } from '../time-range.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITimeRange for edit and NewTimeRangeFormGroupInput for create.
 */
type TimeRangeFormGroupInput = ITimeRange | PartialWithRequiredKeyOf<NewTimeRange>;

type TimeRangeFormDefaults = Pick<NewTimeRange, 'id'>;

type TimeRangeFormGroupContent = {
  id: FormControl<ITimeRange['id'] | NewTimeRange['id']>;
  name: FormControl<ITimeRange['name']>;
  rangeSize: FormControl<ITimeRange['rangeSize']>;
  duration: FormControl<ITimeRange['duration']>;
  description: FormControl<ITimeRange['description']>;
};

export type TimeRangeFormGroup = FormGroup<TimeRangeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TimeRangeFormService {
  createTimeRangeFormGroup(timeRange: TimeRangeFormGroupInput = { id: null }): TimeRangeFormGroup {
    const timeRangeRawValue = {
      ...this.getFormDefaults(),
      ...timeRange,
    };
    return new FormGroup<TimeRangeFormGroupContent>({
      id: new FormControl(
        { value: timeRangeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(timeRangeRawValue.name),
      rangeSize: new FormControl(timeRangeRawValue.rangeSize),
      duration: new FormControl(timeRangeRawValue.duration),
      description: new FormControl(timeRangeRawValue.description),
    });
  }

  getTimeRange(form: TimeRangeFormGroup): ITimeRange | NewTimeRange {
    return form.getRawValue() as ITimeRange | NewTimeRange;
  }

  resetForm(form: TimeRangeFormGroup, timeRange: TimeRangeFormGroupInput): void {
    const timeRangeRawValue = { ...this.getFormDefaults(), ...timeRange };
    form.reset(
      {
        ...timeRangeRawValue,
        id: { value: timeRangeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TimeRangeFormDefaults {
    return {
      id: null,
    };
  }
}
