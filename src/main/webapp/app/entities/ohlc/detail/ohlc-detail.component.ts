import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOhlc } from '../ohlc.model';

@Component({
  selector: 'jhi-ohlc-detail',
  templateUrl: './ohlc-detail.component.html',
})
export class OhlcDetailComponent implements OnInit {
  ohlc: IOhlc | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ohlc }) => {
      this.ohlc = ohlc;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
