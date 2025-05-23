import { createAction, props } from '@ngrx/store';
import {
  IShipModel,
  IShipResult,
  IShipUpdateDto,
  ShipModel, ShipNewDto,
  ShipUpdateDto
} from '../../services/api/pingapp-api.service';


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

export const loadShip = createAction(
  '[Ship] Load Ship',
  props<{ id: string }>()
);

export const loadShipSuccess = createAction(
  '[Ship] Load Ship Success',
  props<{ ship: IShipResult }>()
);


export const loadShipFailure = createAction(
  '[Ship] Load Ship Failure',
  props<{ error: any }>()
);


export const registerShip = createAction(
  '[Ship] Register New Ship',
  props<{ newShipDto: ShipNewDto }>()
);

export const registerShipSuccess = createAction(
  '[Ship] Register Ship Success',
   props<{ newShip: any }>()
);

export const registerShipFailure = createAction(
  '[Ship] Register Ship Failure',
   props<{ error: any }>()
);



export const updateShip = createAction(
  '[Ship] Update Ship',
  props<{id: string, updateDto: ShipUpdateDto }>()
);

export const updateShipSuccess = createAction(
  '[Ship] Update Ship Success'
);

export const updateShipFailure = createAction(
  '[Ship] Update Ship Failure',
  props<{ error: any }>()
);


// export const upsertOneShip = createAction(
//   '[ShipStatusService] Upsert Ship',
//   props<{ ship: IShipResult }>()
// );

export const upsertManyShips = createAction(
  '[ShipStatusService] Upsert Many Ships',
  props<{ ships: IShipResult[] }>()
);
