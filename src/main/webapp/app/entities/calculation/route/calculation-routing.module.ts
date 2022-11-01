import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CalculationComponent } from '../list/calculation.component';
import { CalculationDetailComponent } from '../detail/calculation-detail.component';
import { CalculationUpdateComponent } from '../update/calculation-update.component';
import { CalculationRoutingResolveService } from './calculation-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const calculationRoute: Routes = [
  {
    path: '',
    component: CalculationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CalculationDetailComponent,
    resolve: {
      calculation: CalculationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CalculationUpdateComponent,
    resolve: {
      calculation: CalculationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CalculationUpdateComponent,
    resolve: {
      calculation: CalculationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(calculationRoute)],
  exports: [RouterModule],
})
export class CalculationRoutingModule {}
