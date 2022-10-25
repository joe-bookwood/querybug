import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PairFormService, PairFormGroup } from './pair-form.service';
import { IPair } from '../pair.model';
import { PairService } from '../service/pair.service';
import { IAsset } from 'app/entities/asset/asset.model';
import { AssetService } from 'app/entities/asset/service/asset.service';

@Component({
  selector: 'jhi-pair-update',
  templateUrl: './pair-update.component.html',
})
export class PairUpdateComponent implements OnInit {
  isSaving = false;
  pair: IPair | null = null;

  assetsSharedCollection: IAsset[] = [];

  editForm: PairFormGroup = this.pairFormService.createPairFormGroup();

  constructor(
    protected pairService: PairService,
    protected pairFormService: PairFormService,
    protected assetService: AssetService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAsset = (o1: IAsset | null, o2: IAsset | null): boolean => this.assetService.compareAsset(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pair }) => {
      this.pair = pair;
      if (pair) {
        this.updateForm(pair);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pair = this.pairFormService.getPair(this.editForm);
    if (pair.id !== null) {
      this.subscribeToSaveResponse(this.pairService.update(pair));
    } else {
      this.subscribeToSaveResponse(this.pairService.create(pair));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPair>>): void {
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

  protected updateForm(pair: IPair): void {
    this.pair = pair;
    this.pairFormService.resetForm(this.editForm, pair);

    this.assetsSharedCollection = this.assetService.addAssetToCollectionIfMissing<IAsset>(
      this.assetsSharedCollection,
      pair.base,
      pair.quote
    );
  }

  protected loadRelationshipsOptions(): void {
    this.assetService
      .query()
      .pipe(map((res: HttpResponse<IAsset[]>) => res.body ?? []))
      .pipe(map((assets: IAsset[]) => this.assetService.addAssetToCollectionIfMissing<IAsset>(assets, this.pair?.base, this.pair?.quote)))
      .subscribe((assets: IAsset[]) => (this.assetsSharedCollection = assets));
  }
}
