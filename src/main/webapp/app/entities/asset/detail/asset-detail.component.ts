import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAsset } from '../asset.model';

@Component({
  selector: 'jhi-asset-detail',
  templateUrl: './asset-detail.component.html',
})
export class AssetDetailComponent implements OnInit {
  asset: IAsset | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ asset }) => {
      this.asset = asset;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
