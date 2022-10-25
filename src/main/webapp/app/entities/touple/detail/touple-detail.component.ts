import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITouple } from '../touple.model';

@Component({
  selector: 'jhi-touple-detail',
  templateUrl: './touple-detail.component.html',
})
export class ToupleDetailComponent implements OnInit {
  touple: ITouple | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ touple }) => {
      this.touple = touple;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
