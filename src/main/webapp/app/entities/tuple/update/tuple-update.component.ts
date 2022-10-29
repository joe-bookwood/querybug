import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TupleFormService, TupleFormGroup } from './tuple-form.service';
import { ITuple } from '../tuple.model';
import { TupleService } from '../service/tuple.service';
import { ICalculation } from 'app/entities/calculation/calculation.model';
import { CalculationService } from 'app/entities/calculation/service/calculation.service';
import { IOhlc } from 'app/entities/ohlc/ohlc.model';
import { OhlcService } from 'app/entities/ohlc/service/ohlc.service';

@Component({
  selector: 'jhi-tuple-update',
  templateUrl: './tuple-update.component.html',
})
export class TupleUpdateComponent implements OnInit {
  isSaving = false;
  tuple: ITuple | null = null;

  calculationsSharedCollection: ICalculation[] = [];
  ohlcsSharedCollection: IOhlc[] = [];

  editForm: TupleFormGroup = this.tupleFormService.createTupleFormGroup();

  constructor(
    protected tupleService: TupleService,
    protected tupleFormService: TupleFormService,
    protected calculationService: CalculationService,
    protected ohlcService: OhlcService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCalculation = (o1: ICalculation | null, o2: ICalculation | null): boolean => this.calculationService.compareCalculation(o1, o2);

  compareOhlc = (o1: IOhlc | null, o2: IOhlc | null): boolean => this.ohlcService.compareOhlc(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tuple }) => {
      this.tuple = tuple;
      if (tuple) {
        this.updateForm(tuple);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tuple = this.tupleFormService.getTuple(this.editForm);
    if (tuple.id !== null) {
      this.subscribeToSaveResponse(this.tupleService.update(tuple));
    } else {
      this.subscribeToSaveResponse(this.tupleService.create(tuple));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITuple>>): void {
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

  protected updateForm(tuple: ITuple): void {
    this.tuple = tuple;
    this.tupleFormService.resetForm(this.editForm, tuple);

    this.calculationsSharedCollection = this.calculationService.addCalculationToCollectionIfMissing<ICalculation>(
      this.calculationsSharedCollection,
      tuple.calculation
    );
    this.ohlcsSharedCollection = this.ohlcService.addOhlcToCollectionIfMissing<IOhlc>(this.ohlcsSharedCollection, tuple.ohlc);
  }

  protected loadRelationshipsOptions(): void {
    this.calculationService
      .query()
      .pipe(map((res: HttpResponse<ICalculation[]>) => res.body ?? []))
      .pipe(
        map((calculations: ICalculation[]) =>
          this.calculationService.addCalculationToCollectionIfMissing<ICalculation>(calculations, this.tuple?.calculation)
        )
      )
      .subscribe((calculations: ICalculation[]) => (this.calculationsSharedCollection = calculations));

    this.ohlcService
      .query()
      .pipe(map((res: HttpResponse<IOhlc[]>) => res.body ?? []))
      .pipe(map((ohlcs: IOhlc[]) => this.ohlcService.addOhlcToCollectionIfMissing<IOhlc>(ohlcs, this.tuple?.ohlc)))
      .subscribe((ohlcs: IOhlc[]) => (this.ohlcsSharedCollection = ohlcs));
  }
}
