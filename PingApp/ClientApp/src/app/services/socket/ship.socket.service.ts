import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { IShipStatusDto } from '../api/pingapp-api.service';
import { Store } from '@ngrx/store';
import * as ShipActions from '../../state/actions/ship.actions';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ShipSocketService {
  private readonly _displayScreenConnection: signalR.HubConnection;
  private readonly _store = inject(Store);
  private started = false;
  private retryTimer?: ReturnType<typeof setTimeout>;


  constructor() {
    this._displayScreenConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalRUrl)
      .withAutomaticReconnect()
      .build();

    this.registerHandlers();
  }

  private registerHandlers(): void {

    this._displayScreenConnection.off('DisplayShips');
    this._displayScreenConnection.on('DisplayShips', (extShipsUpsertDto: IShipStatusDto[]) => {
      this._store.dispatch(ShipActions.externalShipsUpsert({ extShipsUpsertDto }));
    });

    this._displayScreenConnection.off('ShipCreated');
    this._displayScreenConnection.on('ShipCreated', (extShipCreateDto: IShipStatusDto) => {
      this._store.dispatch(ShipActions.externalShipCreate({extShipCreateDto}));
    });

    this._displayScreenConnection.off('ShipUpdated');
    this._displayScreenConnection.on('ShipUpdated', (extShipUpdateDto: IShipStatusDto) => {
      this._store.dispatch(ShipActions.externalShipUpdate({extShipUpdateDto}));
    });

    this._displayScreenConnection.off('ShipDeleted');
    this._displayScreenConnection.on('ShipDeleted', (id: string) => {
      console.log('[ShipSocket]: ShipDeleted', id);
      this._store.dispatch(ShipActions.externalShipDelete({id: id as any}));
    });

  }



  public startUpConnection(): void {

    if (this.started) {
      return;
    }

    this.started = true;

    const start = () => {

      if (
        !this.started ||
        this._displayScreenConnection.state !== signalR.HubConnectionState.Disconnected
        ) {
         return;
        }

        this._displayScreenConnection
        .start()
        .then(() => {
          console.log('SignalR state:', this._displayScreenConnection.state)
        })
        .catch(error => {

          if (!this.started) {
            return;
            }


          console.error('SignalR initial start failed, retrying in 3s...', error);
          // setTimeout(start, 3000);
          this.retryTimer = setTimeout(start, 3000);
        });
    };

    start();
  }

  public stopConnection(): void {
    // if (this._displayScreenConnection) {

    this.started = false;

     if (this.retryTimer) {
        clearTimeout(this.retryTimer);
        this.retryTimer = undefined;
    }

      if (
      this._displayScreenConnection.state !==
      signalR.HubConnectionState.Disconnected
      ) {




    this._displayScreenConnection
        .stop()
        .then(() => console.log('SignalR state:', this._displayScreenConnection.state));
    }
  }


}
