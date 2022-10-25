import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITouple } from '../touple.model';
import { ToupleService } from '../service/touple.service';

@Injectable({ providedIn: 'root' })
export class ToupleRoutingResolveService implements Resolve<ITouple | null> {
  constructor(protected service: ToupleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITouple | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((touple: HttpResponse<ITouple>) => {
          if (touple.body) {
            return of(touple.body);
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
