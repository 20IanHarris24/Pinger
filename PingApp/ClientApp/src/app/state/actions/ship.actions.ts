import { createAction, props } from '@ngrx/store';
import {
  ShipCreateDto,
  ShipDto,
  ShipUpdateDto,
  IShipStatusDto
} from '../../services/api/pingapp-api.service';

export const createShip = createAction(
  '[Action] CREATE ship',
  props<{ createNewShipDto: ShipCreateDto }>()
);

export const createShipSuccess = createAction(
  '[Action] CREATE ship success',
   props<{ createNewShipSuccess: IShipStatusDto }>()
);

export const createShipFailure = createAction(
  '[Action] CREATE ship failure',
   props<{ error: any }>()
);

export const deleteShip = createAction(
 '[Action] DELETE Ship',
  props<{ id: string }>()
);

export const deleteShipSuccess = createAction(
  '[Action] DELETE ship success',
   props<{ id: string }>()
);

export const deleteShipFailure = createAction(
  '[Action] DELETE ship failure',
  props<{ error: any }>()
);


export const externalShipCreate = createAction(
  '[Action] EXTERNAL ship create',
  props<{ extShipCreateDto: IShipStatusDto }>()
)


export const externalShipDelete = createAction(
  '[Action] EXTERNAL ship delete',
  props<{ id: string }>()
)


export const externalShipUpdate = createAction(
  '[Action] EXTERNAL ship update',
  props<{ extShipUpdateDto: IShipStatusDto }>()
)

export const externalShipsUpsert = createAction(
  '[Action] EXTERNAL ship upserts',
  props<{ extShipsUpsertDto: IShipStatusDto[] }>()
)


export const loadAllShips = createAction('[Ship] LOAD All ships');

export const loadAllShipsSuccess = createAction(
  '[Action] LOAD All ships success',
  props<{ ships: IShipStatusDto[] }>()
);

export const loadAllShipsFailure = createAction(
  '[Action] LOAD All ships failure',
  props<{ error: any }>()
);

export const loadPaginatedShips = createAction(
  '[Action] LOAD Paginated ships',
  props<{ page: number }>()
);

export const loadPaginatedShipsSuccess = createAction(
  '[Action] LOAD Paginated ships success',
  props<{ ships: ShipDto[]; page: number; pageSize: number; totalPages: number; totalItems: number;  sort: string; direction: string; }>()
);

export const loadPaginatedShipsFailure = createAction(
  '[Action] LOAD Paginated ships failure',
  props<{ error: unknown }>()
);


export const loadShip = createAction(
  '[Action] LOAD Ship',
  props<{ id: string }>()
);

export const loadShipSuccess = createAction(
  '[Action] LOAD ship success',
  props<{ ship: IShipStatusDto }>()
);


export const loadShipFailure = createAction(
  '[Action] LOAD ship failure',
  props<{ error: any }>()
);




export const reloadCurrentPage = createAction(
  '[Action] RELOAD current page'
);



export const setAddedShipId = createAction(
  '[Action] set ADDED ship Id',
  props<{ idTrack: string | null }>()
);


export const setUpdatedShipId = createAction(
  '[Action] set UPDATED ship Id',
  props<{ editedShipId: string | null }>()
);


export const setDeletedId = createAction(
  '[Action] set DELETED Ship Id',
  props<{ idTrack: string }>()
);




export const updateShip = createAction(
  '[Action] EDIT ship',
  props<{id: string, updateDto: ShipUpdateDto }>()
);

export const updateShipSuccess = createAction(
  '[Action] EDIT ship success',
  props<{ updatedShip: IShipStatusDto }>()
);

export const updateShipFailure = createAction(
  '[Action] EDIT ship failure',
  props<{ error: any }>()
);

export const upsertManyShips = createAction(
  '[Action] UPSERT all ships',
  props<{ ships: IShipStatusDto[] }>()
);
