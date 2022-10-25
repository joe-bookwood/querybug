import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ToupleFormService, ToupleFormGroup } from './touple-form.service';
import { ITouple } from '../touple.model';
import { ToupleService } from '../service/touple.service';
import { ICalculation } from 'app/entities/calculation/calculation.model';
import { CalculationService } from 'app/entities/calculation/service/calculation.service';
import { IOhlc } from 'app/entities/ohlc/ohlc.model';
import { OhlcService } from 'app/entities/ohlc/service/ohlc.service';

@Component({
  selector: 'jhi-touple-update',
  templateUrl: './touple-update.component.html',
})
export class ToupleUpdateComponent implements OnInit {
  isSaving = false;
  touple: ITouple | null = null;

  calculationsSharedCollection: ICalculation[] = [];
  ohlcsSharedCollection: IOhlc[] = [];

  editForm: ToupleFormGroup = this.toupleFormService.createToupleFormGroup();

  constructor(
    protected toupleService: ToupleService,
    protected toupleFormService: ToupleFormService,
    protected calculationService: CalculationService,
    protected ohlcService: OhlcService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCalculation = (o1: ICalculation | null, o2: ICalculation | null): boolean => this.calculationService.compareCalculation(o1, o2);

  compareOhlc = (o1: IOhlc | null, o2: IOhlc | null): boolean => this.ohlcService.compareOhlc(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ touple }) => {
      this.touple = touple;
      if (touple) {
        this.updateForm(touple);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const touple = this.toupleFormService.getTouple(this.editForm);
    if (touple.id !== null) {
      this.subscribeToSaveResponse(this.toupleService.update(touple));
    } else {
      this.subscribeToSaveResponse(this.toupleService.create(touple));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITouple>>): void {
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

  protected updateForm(touple: ITouple): void {
    this.touple = touple;
    this.toupleFormService.resetForm(this.editForm, touple);

    this.calculationsSharedCollection = this.calculationService.addCalculationToCollectionIfMissing<ICalculation>(
      this.calculationsSharedCollection,
      touple.calculation
    );
    this.ohlcsSharedCollection = this.ohlcService.addOhlcToCollectionIfMissing<IOhlc>(this.ohlcsSharedCollection, touple.ohlc);
  }

  protected loadRelationshipsOptions(): void {
    this.calculationService
      .query()
      .pipe(map((res: HttpResponse<ICalculation[]>) => res.body ?? []))
      .pipe(
        map((calculations: ICalculation[]) =>
          this.calculationService.addCalculationToCollectionIfMissing<ICalculation>(calculations, this.touple?.calculation)
        )
      )
      .subscribe((calculations: ICalculation[]) => (this.calculationsSharedCollection = calculations));

    this.ohlcService
      .query()
      .pipe(map((res: HttpResponse<IOhlc[]>) => res.body ?? []))
      .pipe(map((ohlcs: IOhlc[]) => this.ohlcService.addOhlcToCollectionIfMissing<IOhlc>(ohlcs, this.touple?.ohlc)))
      .subscribe((ohlcs: IOhlc[]) => (this.ohlcsSharedCollection = ohlcs));
  }
}
