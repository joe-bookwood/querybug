import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AssetComponent } from '../list/asset.component';
import { AssetDetailComponent } from '../detail/asset-detail.component';
import { AssetUpdateComponent } from '../update/asset-update.component';
import { AssetRoutingResolveService } from './asset-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const assetRoute: Routes = [
  {
    path: '',
    component: AssetComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AssetDetailComponent,
    resolve: {
      asset: AssetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssetUpdateComponent,
    resolve: {
      asset: AssetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AssetUpdateComponent,
    resolve: {
      asset: AssetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(assetRoute)],
  exports: [RouterModule],
})
export class AssetRoutingModule {}
