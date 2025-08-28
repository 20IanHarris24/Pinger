import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {ShipResult} from '../../services/api/pingapp-api.service';
import { Store } from '@ngrx/store';
import * as ShipActions from '../../state/actions/ship.actions';

@Injectable({ providedIn: 'root' })
export class ShipSocketService {
  private readonly _displayScreenConnection: signalR.HubConnection;
  private readonly _store = inject(Store);

  constructor() {
    this._displayScreenConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://127.0.0.1:34011/display')
      .withAutomaticReconnect()
      .build();
   }

  public startUpConnection(): void {
    this._displayScreenConnection
      .start()
      .then(() => {
        console.log('SignalR socket status: ', this._displayScreenConnection.state);

        this._displayScreenConnection.on('DisplayShips',(ships: ShipResult[]) => {
             this._store.dispatch(ShipActions.upsertManyShips({ships: ships,}));
        });

        this._displayScreenConnection.on('ShipCreated', (newShip: any) => {
          this._store.dispatch(ShipActions.registerShipSuccess({ newShip }));
        });

        // this._displayScreenConnection.on('ShipUpdated', (editShip: ShipResult) => {
        //   const editShipInstance = ShipResult.fromJS(editShip);
        //   this._store.dispatch(ShipActions.updateShipSuccess({editShip: editShipInstance}));
        // });

        this._displayScreenConnection.on('ShipUpdated', () => {
          this._store.dispatch(ShipActions.reloadCurrentPage());
        });


        // this._displayScreenConnection.on('ShipDeleted', (deletedShipId: string) => {
        //   this._store.dispatch(ShipActions.deleteShipSuccess({ id: deletedShipId }));
        // });

        this._displayScreenConnection.on('ShipDeleted', () => {
          this._store.dispatch(ShipActions.reloadCurrentPage());
        });

      })

      .catch((err) => console.error('SignalR error:', err));
  }

  public stopConnection(): void {
    if (this._displayScreenConnection) {
      this._displayScreenConnection
        .stop()
        .then(() => console.log('SignalR socket disconnected'));
    }
  }
}
