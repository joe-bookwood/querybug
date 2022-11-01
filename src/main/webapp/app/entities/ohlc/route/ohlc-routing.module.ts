import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OhlcComponent } from '../list/ohlc.component';
import { OhlcDetailComponent } from '../detail/ohlc-detail.component';
import { OhlcUpdateComponent } from '../update/ohlc-update.component';
import { OhlcRoutingResolveService } from './ohlc-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const ohlcRoute: Routes = [
  {
    path: '',
    component: OhlcComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OhlcDetailComponent,
    resolve: {
      ohlc: OhlcRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OhlcUpdateComponent,
    resolve: {
      ohlc: OhlcRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OhlcUpdateComponent,
    resolve: {
      ohlc: OhlcRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ohlcRoute)],
  exports: [RouterModule],
})
export class OhlcRoutingModule {}
