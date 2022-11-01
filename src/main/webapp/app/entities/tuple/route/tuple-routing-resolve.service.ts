import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITuple } from '../tuple.model';
import { TupleService } from '../service/tuple.service';

@Injectable({ providedIn: 'root' })
export class TupleRoutingResolveService implements Resolve<ITuple | null> {
  constructor(protected service: TupleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITuple | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tuple: HttpResponse<ITuple>) => {
          if (tuple.body) {
            return of(tuple.body);
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
