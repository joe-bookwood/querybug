import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPair } from '../pair.model';

@Component({
  selector: 'jhi-pair-detail',
  templateUrl: './pair-detail.component.html',
})
export class PairDetailComponent implements OnInit {
  pair: IPair | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pair }) => {
      this.pair = pair;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
