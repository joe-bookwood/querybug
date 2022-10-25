import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChart } from '../chart.model';

@Component({
  selector: 'jhi-chart-detail',
  templateUrl: './chart-detail.component.html',
})
export class ChartDetailComponent implements OnInit {
  chart: IChart | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chart }) => {
      this.chart = chart;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
