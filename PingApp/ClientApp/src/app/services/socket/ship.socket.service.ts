import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ShipResult } from '../api/pingapp-api.service';
import { Store } from '@ngrx/store';
import * as ShipActions from '../../state/actions/ship.actions';

@Injectable({ providedIn: 'root' })
export class ShipSocketService {
  private readonly _displayScreenConnection: signalR.HubConnection;
  private readonly _store = inject(Store);

  constructor() {
    this._displayScreenConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:34011/display')
      .withAutomaticReconnect()
      .build();

    this.registerHandlers();
  }

  private registerHandlers(): void {
    this._displayScreenConnection.on('DisplayShips', (ships: ShipResult[]) => {
      this._store.dispatch(ShipActions.upsertManyShips({ ships }));
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

    this._displayScreenConnection.on('ShipDeleted', () => {
      this._store.dispatch(ShipActions.reloadCurrentPage());
    });


  // this._displayScreenConnection.on('ShipDeleted', (deletedShipId: string) => {
  //   this._store.dispatch(ShipActions.deleteShipSuccess({ id: deletedShipId }));
  // });
  }



  public startUpConnection(): void {
    const start = () => {
      this._displayScreenConnection
        .start()
        .then(() => {
          console.log('SignalR connected. State:', this._displayScreenConnection.state);
        })
        .catch(err => {
          console.error('SignalR initial start failed, retrying in 3s...', err);
          setTimeout(start, 3000);
        });
    };

    start();
  }

  public stopConnection(): void {
    if (this._displayScreenConnection) {
      this._displayScreenConnection
        .stop()
        .then(() => console.log('SignalR socket disconnected'));
    }
  }






}
