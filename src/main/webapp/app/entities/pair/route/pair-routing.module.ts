import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PairComponent } from '../list/pair.component';
import { PairDetailComponent } from '../detail/pair-detail.component';
import { PairUpdateComponent } from '../update/pair-update.component';
import { PairRoutingResolveService } from './pair-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const pairRoute: Routes = [
  {
    path: '',
    component: PairComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PairDetailComponent,
    resolve: {
      pair: PairRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PairUpdateComponent,
    resolve: {
      pair: PairRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PairUpdateComponent,
    resolve: {
      pair: PairRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pairRoute)],
  exports: [RouterModule],
})
export class PairRoutingModule {}
