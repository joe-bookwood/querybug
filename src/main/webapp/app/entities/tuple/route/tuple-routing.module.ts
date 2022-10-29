import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TupleComponent } from '../list/tuple.component';
import { TupleDetailComponent } from '../detail/tuple-detail.component';
import { TupleUpdateComponent } from '../update/tuple-update.component';
import { TupleRoutingResolveService } from './tuple-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const tupleRoute: Routes = [
  {
    path: '',
    component: TupleComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TupleDetailComponent,
    resolve: {
      tuple: TupleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TupleUpdateComponent,
    resolve: {
      tuple: TupleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TupleUpdateComponent,
    resolve: {
      tuple: TupleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tupleRoute)],
  exports: [RouterModule],
})
export class TupleRoutingModule {}
