import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FeeFormService, FeeFormGroup } from './fee-form.service';
import { IFee } from '../fee.model';
import { FeeService } from '../service/fee.service';
import { IPair } from 'app/entities/pair/pair.model';
import { PairService } from 'app/entities/pair/service/pair.service';

@Component({
  selector: 'jhi-fee-update',
  templateUrl: './fee-update.component.html',
})
export class FeeUpdateComponent implements OnInit {
  isSaving = false;
  fee: IFee | null = null;

  pairsSharedCollection: IPair[] = [];

  editForm: FeeFormGroup = this.feeFormService.createFeeFormGroup();

  constructor(
    protected feeService: FeeService,
    protected feeFormService: FeeFormService,
    protected pairService: PairService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePair = (o1: IPair | null, o2: IPair | null): boolean => this.pairService.comparePair(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fee }) => {
      this.fee = fee;
      if (fee) {
        this.updateForm(fee);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fee = this.feeFormService.getFee(this.editForm);
    if (fee.id !== null) {
      this.subscribeToSaveResponse(this.feeService.update(fee));
    } else {
      this.subscribeToSaveResponse(this.feeService.create(fee));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFee>>): void {
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

  protected updateForm(fee: IFee): void {
    this.fee = fee;
    this.feeFormService.resetForm(this.editForm, fee);

    this.pairsSharedCollection = this.pairService.addPairToCollectionIfMissing<IPair>(this.pairsSharedCollection, fee.pair);
  }

  protected loadRelationshipsOptions(): void {
    this.pairService
      .query()
      .pipe(map((res: HttpResponse<IPair[]>) => res.body ?? []))
      .pipe(map((pairs: IPair[]) => this.pairService.addPairToCollectionIfMissing<IPair>(pairs, this.fee?.pair)))
      .subscribe((pairs: IPair[]) => (this.pairsSharedCollection = pairs));
  }
}
