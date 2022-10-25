import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TimeRangeComponent } from './list/time-range.component';
import { TimeRangeDetailComponent } from './detail/time-range-detail.component';
import { TimeRangeUpdateComponent } from './update/time-range-update.component';
import { TimeRangeDeleteDialogComponent } from './delete/time-range-delete-dialog.component';
import { TimeRangeRoutingModule } from './route/time-range-routing.module';

@NgModule({
  imports: [SharedModule, TimeRangeRoutingModule],
  declarations: [TimeRangeComponent, TimeRangeDetailComponent, TimeRangeUpdateComponent, TimeRangeDeleteDialogComponent],
})
export class TimeRangeModule {}
