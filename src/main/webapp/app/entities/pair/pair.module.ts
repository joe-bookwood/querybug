import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PairComponent } from './list/pair.component';
import { PairDetailComponent } from './detail/pair-detail.component';
import { PairUpdateComponent } from './update/pair-update.component';
import { PairDeleteDialogComponent } from './delete/pair-delete-dialog.component';
import { PairRoutingModule } from './route/pair-routing.module';

@NgModule({
  imports: [SharedModule, PairRoutingModule],
  declarations: [PairComponent, PairDetailComponent, PairUpdateComponent, PairDeleteDialogComponent],
})
export class PairModule {}
