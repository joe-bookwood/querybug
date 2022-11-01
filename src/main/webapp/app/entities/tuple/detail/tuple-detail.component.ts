import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITuple } from '../tuple.model';

@Component({
  selector: 'jhi-tuple-detail',
  templateUrl: './tuple-detail.component.html',
})
export class TupleDetailComponent implements OnInit {
  tuple: ITuple | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tuple }) => {
      this.tuple = tuple;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
