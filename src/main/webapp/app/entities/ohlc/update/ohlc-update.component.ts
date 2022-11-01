import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OhlcFormService, OhlcFormGroup } from './ohlc-form.service';
import { IOhlc } from '../ohlc.model';
import { OhlcService } from '../service/ohlc.service';
import { IChart } from 'app/entities/chart/chart.model';
import { ChartService } from 'app/entities/chart/service/chart.service';

@Component({
  selector: 'jhi-ohlc-update',
  templateUrl: './ohlc-update.component.html',
})
export class OhlcUpdateComponent implements OnInit {
  isSaving = false;
  ohlc: IOhlc | null = null;

  chartsSharedCollection: IChart[] = [];

  editForm: OhlcFormGroup = this.ohlcFormService.createOhlcFormGroup();

  constructor(
    protected ohlcService: OhlcService,
    protected ohlcFormService: OhlcFormService,
    protected chartService: ChartService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareChart = (o1: IChart | null, o2: IChart | null): boolean => this.chartService.compareChart(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ohlc }) => {
      this.ohlc = ohlc;
      if (ohlc) {
        this.updateForm(ohlc);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ohlc = this.ohlcFormService.getOhlc(this.editForm);
    if (ohlc.id !== null) {
      this.subscribeToSaveResponse(this.ohlcService.update(ohlc));
    } else {
      this.subscribeToSaveResponse(this.ohlcService.create(ohlc));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOhlc>>): void {
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

  protected updateForm(ohlc: IOhlc): void {
    this.ohlc = ohlc;
    this.ohlcFormService.resetForm(this.editForm, ohlc);

    this.chartsSharedCollection = this.chartService.addChartToCollectionIfMissing<IChart>(this.chartsSharedCollection, ohlc.chart);
  }

  protected loadRelationshipsOptions(): void {
    this.chartService
      .query()
      .pipe(map((res: HttpResponse<IChart[]>) => res.body ?? []))
      .pipe(map((charts: IChart[]) => this.chartService.addChartToCollectionIfMissing<IChart>(charts, this.ohlc?.chart)))
      .subscribe((charts: IChart[]) => (this.chartsSharedCollection = charts));
  }
}
