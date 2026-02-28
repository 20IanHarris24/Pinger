import { Injectable } from '@angular/core';
import { IShipStatusDto, ShipCreateDto } from './api/pingapp-api.service';
import { ShipDeleteService } from './ship.delete.service';
import { ShipModalFlowService } from './ship.modal.service';
import {createShip, deleteShip, updateShip} from '../state/actions/ship.actions';
import { Store } from '@ngrx/store';



@Injectable({ providedIn: 'root' })
export class ActionService {


  constructor(private store: Store, private deleteState: ShipDeleteService, private shipModalFlow: ShipModalFlowService) {}


  select(action: 'New'): Promise<void>;
  select(action: 'Edit' | 'Delete', shipInFocus: IShipStatusDto): Promise<void>;
  async select(action: 'New' | 'Edit' | 'Delete', shipInFocus?: IShipStatusDto): Promise<void>
  {
    switch (action) {
      case 'New': {
        const dtos: ShipCreateDto[] = await this.shipModalFlow.launchNew();

        for (const dto of dtos) {
          this.store.dispatch(
            createShip({createNewShipDto: dto})
          );
        }

        break;
      }

      case 'Edit':
        if (shipInFocus) {
          const dtoUpdate = await this.shipModalFlow.launchUpdate(shipInFocus.id)
          if (!dtoUpdate) return;
          console.log('ship to be updated', shipInFocus.id);
          this.store.dispatch(updateShip({id: shipInFocus.id, updateDto: dtoUpdate}));

        }
        break;

      case 'Delete':
        if (shipInFocus) {
          const dtoDelete = await this.shipModalFlow.launchDelete(shipInFocus.id);
          if (!dtoDelete) return;
          this.deleteState.reset();
          console.log('ship to be deleted', shipInFocus.id);
          this.store.dispatch(deleteShip({ id: shipInFocus.id }));
          }
        break;
    }
  }
}
