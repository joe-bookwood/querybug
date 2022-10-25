import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChartComponent } from './list/chart.component';
import { ChartDetailComponent } from './detail/chart-detail.component';
import { ChartUpdateComponent } from './update/chart-update.component';
import { ChartDeleteDialogComponent } from './delete/chart-delete-dialog.component';
import { ChartRoutingModule } from './route/chart-routing.module';

@NgModule({
  imports: [SharedModule, ChartRoutingModule],
  declarations: [ChartComponent, ChartDetailComponent, ChartUpdateComponent, ChartDeleteDialogComponent],
})
export class ChartModule {}
