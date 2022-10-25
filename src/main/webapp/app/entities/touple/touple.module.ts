import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ToupleComponent } from './list/touple.component';
import { ToupleDetailComponent } from './detail/touple-detail.component';
import { ToupleUpdateComponent } from './update/touple-update.component';
import { ToupleDeleteDialogComponent } from './delete/touple-delete-dialog.component';
import { ToupleRoutingModule } from './route/touple-routing.module';

@NgModule({
  imports: [SharedModule, ToupleRoutingModule],
  declarations: [ToupleComponent, ToupleDetailComponent, ToupleUpdateComponent, ToupleDeleteDialogComponent],
})
export class ToupleModule {}
