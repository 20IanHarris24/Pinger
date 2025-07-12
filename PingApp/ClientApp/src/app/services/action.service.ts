import { Injectable} from '@angular/core';
import { IShipResult } from './api/pingapp-api.service';
import { ModalActionService } from './modal.action.service';
import { ShipDeleteService } from './ship.delete.service';
import { ShipModalFlowService } from './ship.modal.service';



@Injectable({ providedIn: 'root' })
export class ActionService {


  constructor(private modalAction: ModalActionService, private deleteState: ShipDeleteService, private shipFlow: ShipModalFlowService) {}


  select(action: 'New'): void;
  select(action: 'Edit' | 'Delete', shipInFocus: IShipResult): void;
  select(action: 'New' | 'Edit' | 'Delete', shipInFocus?: IShipResult): void {
    switch (action) {
      case 'New':
        void this.shipFlow.launch();
        break;
      case 'Edit':
        if (shipInFocus) {
          this. modalAction.openModalUpdate(shipInFocus.id);
          console.log('ship to be updated', shipInFocus.id);
        }
        break;
      case 'Delete':
        if (shipInFocus) {
          this.deleteState.reset();
          this.modalAction.openModalDelete(shipInFocus.id);
          console.log('ship to be deleted', shipInFocus.id);
        }
        break;
    }
  }
}
