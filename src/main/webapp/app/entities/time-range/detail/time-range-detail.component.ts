import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITimeRange } from '../time-range.model';

@Component({
  selector: 'jhi-time-range-detail',
  templateUrl: './time-range-detail.component.html',
})
export class TimeRangeDetailComponent implements OnInit {
  timeRange: ITimeRange | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ timeRange }) => {
      this.timeRange = timeRange;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
