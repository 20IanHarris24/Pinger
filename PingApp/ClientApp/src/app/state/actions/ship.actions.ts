import { createAction, props } from '@ngrx/store';
import {
  IShipModel,
  IShipResult,
  ShipNewDto,
  ShipUpdateDto
} from '../../services/api/pingapp-api.service';


export const deleteShip = createAction(
 '[Action] Delete Ship',
  props<{ id: string }>()
);

export const deleteShipSuccess = createAction(
  '[Action] Delete Ship Success'
);

export const deleteShipFailure = createAction(
  '[Action] Delete Ship Failure',
  props<{ error: any }>()
);

export const loadAllShips = createAction('[Ship] Load All Ships');

export const loadAllShipsSuccess = createAction(
  '[Action] Load All Ships Success',
  props<{ ships: IShipResult[] }>()
);

export const loadAllShipsFailure = createAction(
  '[Action] Load All Ships Failure',
  props<{ error: any }>()
);

export const loadShip = createAction(
  '[Action] Load Ship',
  props<{ id: string }>()
);

export const loadShipSuccess = createAction(
  '[Action] Load Ship Success',
  props<{ ship: IShipResult }>()
);


export const loadShipFailure = createAction(
  '[Action] Load Ship Failure',
  props<{ error: any }>()
);


export const registerShip = createAction(
  '[Action] Register New Ship',
  props<{ newShipDto: ShipNewDto }>()
);

export const registerShipSuccess = createAction(
  '[Action] Register Ship Success',
   props<{ newShip: any }>()
);

export const registerShipFailure = createAction(
  '[Action] Register Ship Failure',
   props<{ error: any }>()
);



export const updateShip = createAction(
  '[Action] Update Ship',
  props<{id: string, updateDto: ShipUpdateDto }>()
);

export const updateShipSuccess = createAction(
  '[Action] Update Ship Success',
  props<{ editShip: IShipModel }>()
);

export const updateShipFailure = createAction(
  '[Action] Update Ship Failure',
  props<{ error: any }>()
);

export const setAddedShipId = createAction(
  '[Action] Set Newly Added Ship ID',
  props<{ idTrack: string | null }>()
);


export const setEditedShipId = createAction(
  '[Action] Set Newly Edited Ship ID',
  props<{ idEdit: string | null }>()
);


// export const upsertOneShip = createAction(
//   '[ShipStatusService] Upsert Ship',
//   props<{ ship: IShipResult }>()
// );

export const upsertManyShips = createAction(
  '[Action] Upsert Many Ships',
  props<{ ships: IShipResult[] }>()
);
