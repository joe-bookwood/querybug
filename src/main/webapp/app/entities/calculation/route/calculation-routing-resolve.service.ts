import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICalculation } from '../calculation.model';
import { CalculationService } from '../service/calculation.service';

@Injectable({ providedIn: 'root' })
export class CalculationRoutingResolveService implements Resolve<ICalculation | null> {
  constructor(protected service: CalculationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICalculation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((calculation: HttpResponse<ICalculation>) => {
          if (calculation.body) {
            return of(calculation.body);
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
