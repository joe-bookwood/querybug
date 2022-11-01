import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FeeComponent } from './list/fee.component';
import { FeeDetailComponent } from './detail/fee-detail.component';
import { FeeUpdateComponent } from './update/fee-update.component';
import { FeeDeleteDialogComponent } from './delete/fee-delete-dialog.component';
import { FeeRoutingModule } from './route/fee-routing.module';

@NgModule({
  imports: [SharedModule, FeeRoutingModule],
  declarations: [FeeComponent, FeeDetailComponent, FeeUpdateComponent, FeeDeleteDialogComponent],
})
export class FeeModule {}
