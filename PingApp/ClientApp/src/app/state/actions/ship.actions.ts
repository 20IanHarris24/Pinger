import { createAction, props } from '@ngrx/store';
import { IShipResult } from '../../services/api/pingapp-api.service';

export const upsertShip = createAction(
  '[ShipStatusService] Upsert Ship',
  props<{ ship: IShipResult }>()
);
export const upsertManyShips = createAction(
  '[ShipStatusService] Upsert Many Ships',
  props<{ ships: IShipResult[] }>()
);
