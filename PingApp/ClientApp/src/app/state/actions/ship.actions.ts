import { createAction, props } from '@ngrx/store';
import {IShipResult} from '../../services/api/pingapp-api.service';


export const deleteShip = createAction(
 '[Ship] Delete Ship',
  props<{ id: string }>()
);

export const deleteShipSuccess = createAction(
  '[Ship] Delete Ship Success'
);

export const deleteShipFailure = createAction(
  '[Ship] Delete Ship Failure',
  props<{ error: any }>()
);

export const loadAllShips = createAction('[Ship] Load All Ships');

export const loadAllShipsSuccess = createAction(
  '[Ship] Load All Ships Success',
  props<{ ships: IShipResult[] }>()
);

export const loadAllShipsFailure = createAction(
  '[Ship] Load All Ships Failure',
  props<{ error: any }>()
);

// export const upsertShip = createAction(
//   '[ShipStatusService] Upsert Ship',
//   props<{ ship: IShipResult }>()
// );
export const upsertManyShips = createAction(
  '[ShipStatusService] Upsert Many Ships',
  props<{ ships: IShipResult[] }>()
);
