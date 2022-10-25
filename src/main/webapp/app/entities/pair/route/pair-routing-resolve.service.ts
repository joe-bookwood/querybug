import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPair } from '../pair.model';
import { PairService } from '../service/pair.service';

@Injectable({ providedIn: 'root' })
export class PairRoutingResolveService implements Resolve<IPair | null> {
  constructor(protected service: PairService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPair | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pair: HttpResponse<IPair>) => {
          if (pair.body) {
            return of(pair.body);
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
