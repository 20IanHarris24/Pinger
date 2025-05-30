import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ShipResult } from '../api/pingapp-api.service';
import { Store } from '@ngrx/store';
import { upsertManyShips } from '../../state/actions/ship.actions';

@Injectable({ providedIn: 'root' })
export class ShipSocketService {
  private readonly _displayScreenConnection: signalR.HubConnection;
  // private _ships$: BehaviorSubject<ShipResult[]>;
  // ships$: Observable<ShipResult[]>;

  private readonly _store = inject(Store);

  constructor() {
    this._displayScreenConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://127.0.0.1:34011/display')
      .withAutomaticReconnect()
      .build();
    // this._ships$ = new BehaviorSubject<ShipResult[]>([]);
    // this.ships$ = this._ships$.asObservable();
  }

  public startUpConnection(): void {
    this._displayScreenConnection
      .start()
      .then(() => {
        console.log(this._displayScreenConnection);

        this._displayScreenConnection.on(
          'DisplayShips',
          (ships: ShipResult[]) => {
             this._store.dispatch(
              upsertManyShips({
                ships: ships,
              })
            );
          }
        );
      })

      .catch((err) => console.error('SignalR error:', err));
  }

  public stopConnection(): void {
    if (this._displayScreenConnection) {
      this._displayScreenConnection
        .stop()
        .then(() => console.log('🔌 SignalR disconnected'));
    }
  }
}
