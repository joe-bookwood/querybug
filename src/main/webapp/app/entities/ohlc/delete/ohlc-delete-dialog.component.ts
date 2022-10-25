import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOhlc } from '../ohlc.model';
import { OhlcService } from '../service/ohlc.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './ohlc-delete-dialog.component.html',
})
export class OhlcDeleteDialogComponent {
  ohlc?: IOhlc;

  constructor(protected ohlcService: OhlcService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ohlcService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
