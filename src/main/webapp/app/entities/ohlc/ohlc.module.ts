import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OhlcComponent } from './list/ohlc.component';
import { OhlcDetailComponent } from './detail/ohlc-detail.component';
import { OhlcUpdateComponent } from './update/ohlc-update.component';
import { OhlcDeleteDialogComponent } from './delete/ohlc-delete-dialog.component';
import { OhlcRoutingModule } from './route/ohlc-routing.module';

@NgModule({
  imports: [SharedModule, OhlcRoutingModule],
  declarations: [OhlcComponent, OhlcDetailComponent, OhlcUpdateComponent, OhlcDeleteDialogComponent],
})
export class OhlcModule {}
