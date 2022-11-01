import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AssetComponent } from './list/asset.component';
import { AssetDetailComponent } from './detail/asset-detail.component';
import { AssetUpdateComponent } from './update/asset-update.component';
import { AssetDeleteDialogComponent } from './delete/asset-delete-dialog.component';
import { AssetRoutingModule } from './route/asset-routing.module';

@NgModule({
  imports: [SharedModule, AssetRoutingModule],
  declarations: [AssetComponent, AssetDetailComponent, AssetUpdateComponent, AssetDeleteDialogComponent],
})
export class AssetModule {}
