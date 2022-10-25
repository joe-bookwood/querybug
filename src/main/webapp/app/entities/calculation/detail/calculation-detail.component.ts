import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICalculation } from '../calculation.model';

@Component({
  selector: 'jhi-calculation-detail',
  templateUrl: './calculation-detail.component.html',
})
export class CalculationDetailComponent implements OnInit {
  calculation: ICalculation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ calculation }) => {
      this.calculation = calculation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
