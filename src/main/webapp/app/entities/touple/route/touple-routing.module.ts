import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ToupleComponent } from '../list/touple.component';
import { ToupleDetailComponent } from '../detail/touple-detail.component';
import { ToupleUpdateComponent } from '../update/touple-update.component';
import { ToupleRoutingResolveService } from './touple-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const toupleRoute: Routes = [
  {
    path: '',
    component: ToupleComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ToupleDetailComponent,
    resolve: {
      touple: ToupleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ToupleUpdateComponent,
    resolve: {
      touple: ToupleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ToupleUpdateComponent,
    resolve: {
      touple: ToupleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(toupleRoute)],
  exports: [RouterModule],
})
export class ToupleRoutingModule {}
