import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CalculationComponent } from './list/calculation.component';
import { CalculationDetailComponent } from './detail/calculation-detail.component';
import { CalculationUpdateComponent } from './update/calculation-update.component';
import { CalculationDeleteDialogComponent } from './delete/calculation-delete-dialog.component';
import { CalculationRoutingModule } from './route/calculation-routing.module';

@NgModule({
  imports: [SharedModule, CalculationRoutingModule],
  declarations: [CalculationComponent, CalculationDetailComponent, CalculationUpdateComponent, CalculationDeleteDialogComponent],
})
export class CalculationModule {}
