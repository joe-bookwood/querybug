import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChart } from '../chart.model';
import { ChartService } from '../service/chart.service';

@Injectable({ providedIn: 'root' })
export class ChartRoutingResolveService implements Resolve<IChart | null> {
  constructor(protected service: ChartService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChart | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chart: HttpResponse<IChart>) => {
          if (chart.body) {
            return of(chart.body);
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
