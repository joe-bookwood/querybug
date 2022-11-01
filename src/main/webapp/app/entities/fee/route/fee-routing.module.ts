import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FeeComponent } from '../list/fee.component';
import { FeeDetailComponent } from '../detail/fee-detail.component';
import { FeeUpdateComponent } from '../update/fee-update.component';
import { FeeRoutingResolveService } from './fee-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const feeRoute: Routes = [
  {
    path: '',
    component: FeeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FeeDetailComponent,
    resolve: {
      fee: FeeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FeeUpdateComponent,
    resolve: {
      fee: FeeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FeeUpdateComponent,
    resolve: {
      fee: FeeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(feeRoute)],
  exports: [RouterModule],
})
export class FeeRoutingModule {}
