import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChartComponent } from '../list/chart.component';
import { ChartDetailComponent } from '../detail/chart-detail.component';
import { ChartUpdateComponent } from '../update/chart-update.component';
import { ChartRoutingResolveService } from './chart-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const chartRoute: Routes = [
  {
    path: '',
    component: ChartComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChartDetailComponent,
    resolve: {
      chart: ChartRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChartUpdateComponent,
    resolve: {
      chart: ChartRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChartUpdateComponent,
    resolve: {
      chart: ChartRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chartRoute)],
  exports: [RouterModule],
})
export class ChartRoutingModule {}
