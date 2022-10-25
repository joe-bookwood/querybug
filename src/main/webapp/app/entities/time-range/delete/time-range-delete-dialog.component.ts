import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITimeRange } from '../time-range.model';
import { TimeRangeService } from '../service/time-range.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './time-range-delete-dialog.component.html',
})
export class TimeRangeDeleteDialogComponent {
  timeRange?: ITimeRange;

  constructor(protected timeRangeService: TimeRangeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.timeRangeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
