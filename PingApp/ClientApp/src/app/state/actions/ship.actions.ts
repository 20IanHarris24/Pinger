import { createAction, props } from '@ngrx/store';
import {
  IShipResult, ShipDto,
  ShipNewDto, ShipResult,
  ShipUpdateDto
} from '../../services/api/pingapp-api.service';


export const deleteShip = createAction(
 '[Action] Delete Ship',
  props<{ id: string }>()
);

export const deleteShipSuccess = createAction(
  '[Action] Delete Ship Success',
   props<{ id: string }>()
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

export const loadPaginatedShips = createAction(
  '[Ship] Load Paginated Ships',
  props<{ page: number; size: number; search?: string; sort?: string; direction?: string }>()
);

export const loadPaginatedShipsSuccess = createAction(
  '[Ship] Load Paginated Ships Success',
  props<{ ships: ShipDto[]; page: number; totalPages: number; totalItems: number }>()
);

export const loadPaginatedShipsFailure = createAction(
  '[Ship] Load Paginated Ships Failure',
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



export const setAddedShipId = createAction(
  '[Action] Set Newly Added Ship ID',
  props<{ idTrack: string | null }>()
);


export const setEditedShipId = createAction(
  '[Action] Set Newly Edited Ship Id',
  props<{ idEdit: string | null }>()
);


export const setRecentlyDeletedId = createAction(
  '[Action] Set Recently Deleted Ship Id',
  props<{ idTrack: string }>()
);



export const updateShip = createAction(
  '[Action] Update Ship',
  props<{id: string, updateDto: ShipUpdateDto }>()
);

export const updateShipSuccess = createAction(
  '[Action] Update Ship Success',
  props<{ editShip: ShipResult }>()
);

export const updateShipFailure = createAction(
  '[Action] Update Ship Failure',
  props<{ error: any }>()
);

export const upsertManyShips = createAction(
  '[Action] Upsert Many Ships',
  props<{ ships: IShipResult[] }>()
);
