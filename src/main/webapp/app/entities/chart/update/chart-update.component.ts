import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ChartFormService, ChartFormGroup } from './chart-form.service';
import { IChart } from '../chart.model';
import { ChartService } from '../service/chart.service';
import { IPair } from 'app/entities/pair/pair.model';
import { PairService } from 'app/entities/pair/service/pair.service';
import { ITimeRange } from 'app/entities/time-range/time-range.model';
import { TimeRangeService } from 'app/entities/time-range/service/time-range.service';

@Component({
  selector: 'jhi-chart-update',
  templateUrl: './chart-update.component.html',
})
export class ChartUpdateComponent implements OnInit {
  isSaving = false;
  chart: IChart | null = null;

  pairsSharedCollection: IPair[] = [];
  timeRangesSharedCollection: ITimeRange[] = [];

  editForm: ChartFormGroup = this.chartFormService.createChartFormGroup();

  constructor(
    protected chartService: ChartService,
    protected chartFormService: ChartFormService,
    protected pairService: PairService,
    protected timeRangeService: TimeRangeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePair = (o1: IPair | null, o2: IPair | null): boolean => this.pairService.comparePair(o1, o2);

  compareTimeRange = (o1: ITimeRange | null, o2: ITimeRange | null): boolean => this.timeRangeService.compareTimeRange(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chart }) => {
      this.chart = chart;
      if (chart) {
        this.updateForm(chart);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chart = this.chartFormService.getChart(this.editForm);
    if (chart.id !== null) {
      this.subscribeToSaveResponse(this.chartService.update(chart));
    } else {
      this.subscribeToSaveResponse(this.chartService.create(chart));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChart>>): void {
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

  protected updateForm(chart: IChart): void {
    this.chart = chart;
    this.chartFormService.resetForm(this.editForm, chart);

    this.pairsSharedCollection = this.pairService.addPairToCollectionIfMissing<IPair>(this.pairsSharedCollection, chart.pair);
    this.timeRangesSharedCollection = this.timeRangeService.addTimeRangeToCollectionIfMissing<ITimeRange>(
      this.timeRangesSharedCollection,
      chart.timeRange
    );
  }

  protected loadRelationshipsOptions(): void {
    this.pairService
      .query()
      .pipe(map((res: HttpResponse<IPair[]>) => res.body ?? []))
      .pipe(map((pairs: IPair[]) => this.pairService.addPairToCollectionIfMissing<IPair>(pairs, this.chart?.pair)))
      .subscribe((pairs: IPair[]) => (this.pairsSharedCollection = pairs));

    this.timeRangeService
      .query()
      .pipe(map((res: HttpResponse<ITimeRange[]>) => res.body ?? []))
      .pipe(
        map((timeRanges: ITimeRange[]) =>
          this.timeRangeService.addTimeRangeToCollectionIfMissing<ITimeRange>(timeRanges, this.chart?.timeRange)
        )
      )
      .subscribe((timeRanges: ITimeRange[]) => (this.timeRangesSharedCollection = timeRanges));
  }
}
