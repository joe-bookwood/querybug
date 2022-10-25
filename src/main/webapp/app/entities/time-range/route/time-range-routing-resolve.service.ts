import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITimeRange } from '../time-range.model';
import { TimeRangeService } from '../service/time-range.service';

@Injectable({ providedIn: 'root' })
export class TimeRangeRoutingResolveService implements Resolve<ITimeRange | null> {
  constructor(protected service: TimeRangeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITimeRange | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((timeRange: HttpResponse<ITimeRange>) => {
          if (timeRange.body) {
            return of(timeRange.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
