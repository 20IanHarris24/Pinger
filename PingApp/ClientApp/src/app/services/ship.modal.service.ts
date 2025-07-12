import {Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NewShipModalComponent} from '../components/new-ship-modal/new.ship.modal.component';
import {AddAnotherShipModalComponent} from '../components/addanother-ship-modal/addanother.ship.modal.component';
import {UtilityService} from './utility.service';


@Injectable({ providedIn: 'root' })
export class ShipModalFlowService {
  constructor(private modalService: NgbModal, private element: UtilityService) {}

  async launch(): Promise<void> {
    let keepGoing = true;


    while (keepGoing) {
      this.element.blurActiveElement();
      const shipResult = await this.openNewShipModal();
      if (shipResult !== 'ship-added') break;

      const addAnotherResult = await this.openAddAnotherModal();
      keepGoing = addAnotherResult?.toLowerCase() === 'yes';
    }

  }

  private async openNewShipModal(): Promise<string | undefined> {
    const ref = this.modalService.open(NewShipModalComponent);
    try {
      return await ref.result;
    } catch {
      return undefined;
    }
  }

  private async openAddAnotherModal(): Promise<string | undefined> {
    const ref = this.modalService.open(AddAnotherShipModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
    try {
      return await ref.result;
    } catch {
      return undefined;
    }
  }
}
