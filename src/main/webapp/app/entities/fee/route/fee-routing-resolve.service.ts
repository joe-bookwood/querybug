import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFee } from '../fee.model';
import { FeeService } from '../service/fee.service';

@Injectable({ providedIn: 'root' })
export class FeeRoutingResolveService implements Resolve<IFee | null> {
  constructor(protected service: FeeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFee | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fee: HttpResponse<IFee>) => {
          if (fee.body) {
            return of(fee.body);
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
