import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TimeRangeFormService, TimeRangeFormGroup } from './time-range-form.service';
import { ITimeRange } from '../time-range.model';
import { TimeRangeService } from '../service/time-range.service';

@Component({
  selector: 'jhi-time-range-update',
  templateUrl: './time-range-update.component.html',
})
export class TimeRangeUpdateComponent implements OnInit {
  isSaving = false;
  timeRange: ITimeRange | null = null;

  editForm: TimeRangeFormGroup = this.timeRangeFormService.createTimeRangeFormGroup();

  constructor(
    protected timeRangeService: TimeRangeService,
    protected timeRangeFormService: TimeRangeFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ timeRange }) => {
      this.timeRange = timeRange;
      if (timeRange) {
        this.updateForm(timeRange);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const timeRange = this.timeRangeFormService.getTimeRange(this.editForm);
    if (timeRange.id !== null) {
      this.subscribeToSaveResponse(this.timeRangeService.update(timeRange));
    } else {
      this.subscribeToSaveResponse(this.timeRangeService.create(timeRange));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITimeRange>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(timeRange: ITimeRange): void {
    this.timeRange = timeRange;
    this.timeRangeFormService.resetForm(this.editForm, timeRange);
  }
}
