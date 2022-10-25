import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TimeRangeComponent } from '../list/time-range.component';
import { TimeRangeDetailComponent } from '../detail/time-range-detail.component';
import { TimeRangeUpdateComponent } from '../update/time-range-update.component';
import { TimeRangeRoutingResolveService } from './time-range-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const timeRangeRoute: Routes = [
  {
    path: '',
    component: TimeRangeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TimeRangeDetailComponent,
    resolve: {
      timeRange: TimeRangeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TimeRangeUpdateComponent,
    resolve: {
      timeRange: TimeRangeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TimeRangeUpdateComponent,
    resolve: {
      timeRange: TimeRangeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(timeRangeRoute)],
  exports: [RouterModule],
})
export class TimeRangeRoutingModule {}
