import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOhlc } from '../ohlc.model';
import { OhlcService } from '../service/ohlc.service';

@Injectable({ providedIn: 'root' })
export class OhlcRoutingResolveService implements Resolve<IOhlc | null> {
  constructor(protected service: OhlcService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOhlc | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ohlc: HttpResponse<IOhlc>) => {
          if (ohlc.body) {
            return of(ohlc.body);
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
