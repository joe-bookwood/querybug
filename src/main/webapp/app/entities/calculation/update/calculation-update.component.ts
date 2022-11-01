import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CalculationFormService, CalculationFormGroup } from './calculation-form.service';
import { ICalculation } from '../calculation.model';
import { CalculationService } from '../service/calculation.service';
import { IChart } from 'app/entities/chart/chart.model';
import { ChartService } from 'app/entities/chart/service/chart.service';

@Component({
  selector: 'jhi-calculation-update',
  templateUrl: './calculation-update.component.html',
})
export class CalculationUpdateComponent implements OnInit {
  isSaving = false;
  calculation: ICalculation | null = null;

  chartsSharedCollection: IChart[] = [];

  editForm: CalculationFormGroup = this.calculationFormService.createCalculationFormGroup();

  constructor(
    protected calculationService: CalculationService,
    protected calculationFormService: CalculationFormService,
    protected chartService: ChartService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareChart = (o1: IChart | null, o2: IChart | null): boolean => this.chartService.compareChart(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ calculation }) => {
      this.calculation = calculation;
      if (calculation) {
        this.updateForm(calculation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const calculation = this.calculationFormService.getCalculation(this.editForm);
    if (calculation.id !== null) {
      this.subscribeToSaveResponse(this.calculationService.update(calculation));
    } else {
      this.subscribeToSaveResponse(this.calculationService.create(calculation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICalculation>>): void {
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

  protected updateForm(calculation: ICalculation): void {
    this.calculation = calculation;
    this.calculationFormService.resetForm(this.editForm, calculation);

    this.chartsSharedCollection = this.chartService.addChartToCollectionIfMissing<IChart>(this.chartsSharedCollection, calculation.chart);
  }

  protected loadRelationshipsOptions(): void {
    this.chartService
      .query()
      .pipe(map((res: HttpResponse<IChart[]>) => res.body ?? []))
      .pipe(map((charts: IChart[]) => this.chartService.addChartToCollectionIfMissing<IChart>(charts, this.calculation?.chart)))
      .subscribe((charts: IChart[]) => (this.chartsSharedCollection = charts));
  }
}
