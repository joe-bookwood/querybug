import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TupleComponent } from './list/tuple.component';
import { TupleDetailComponent } from './detail/tuple-detail.component';
import { TupleUpdateComponent } from './update/tuple-update.component';
import { TupleDeleteDialogComponent } from './delete/tuple-delete-dialog.component';
import { TupleRoutingModule } from './route/tuple-routing.module';

@NgModule({
  imports: [SharedModule, TupleRoutingModule],
  declarations: [TupleComponent, TupleDetailComponent, TupleUpdateComponent, TupleDeleteDialogComponent],
})
export class TupleModule {}
