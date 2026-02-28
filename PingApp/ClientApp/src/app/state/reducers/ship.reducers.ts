import { createReducer, on, } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IShipStatusDto } from '../../services/api/pingapp-api.service';
import * as ShipActions from '../actions/ship.actions';
import {
  mergePagedIntoStatus, mergeSocketFillEmptyStatics, ShipStatusPatch
} from '../helper/ship.helper';


export interface ShipState extends EntityState<IShipStatusDto> {

  // UI state
  error: unknown | null;
  isLoading: boolean;


  // Admin paging state
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  sort: string;
  direction: string;
  currentPageIds: string[];
  editedShipAt: number | null;
  editedShipId: string | null;
  newlyAddedShipId: string | null;
  recentlyDeletedId: string | null;


}

export const adapter: EntityAdapter<IShipStatusDto> =
  createEntityAdapter<IShipStatusDto>({
    selectId: (s) => s.id,
    sortComparer: (sa, sb) => sa.name.localeCompare(sb.name),
  });

export const initialState: ShipState = adapter.getInitialState({


  error: undefined,
  isLoading: false,

  // Admin paging state
  page: 1,
  pageSize: 12,
  totalPages: 1,
  totalItems: 0,
  sort: 'name',
  direction: 'desc',
  currentPageIds: [],

  editedShipId: null,
  editedShipAt: null,
  newlyAddedShipId: null,
  recentlyDeletedId: null,


});

export const shipReducer = createReducer(
  initialState,


  on(ShipActions.createShipSuccess, (state, {createNewShipSuccess}) => {
    console.log('[Reducer] CREATE ship success:', createNewShipSuccess);
    return adapter.upsertOne(createNewShipSuccess, state);
  }),


  on(ShipActions.deleteShip, (state) =>
    ({
    ...state,
    isLoading: true,
    })),


  on(ShipActions.deleteShipSuccess, (state, {id}) => {
    const refreshIds = state.currentPageIds.filter(x => x !== id);
    console.log('[Reducer] DELETE ship success');

    return adapter.removeOne(id, {
    ...state,
    currentPageIds: refreshIds,
    totalItems: Math.max(0,state.totalItems - 1),
    });

  }),


  on(ShipActions.externalShipCreate, (state, {extShipCreateDto}) => {
    console.log('[Reducer] EXTERNAL CREATE ship');
    return adapter.upsertOne(extShipCreateDto, state);

  }),

  on(ShipActions.externalShipDelete, (state, {id}) => {
    const refreshExtIds = state.currentPageIds.filter(x => x !== id);
    console.log('[Reducer] EXTERNAL DELETE ship');

    return adapter.removeOne(id, {
      ...state,
      currentPageIds: refreshExtIds,
      totalItems: Math.max(0,state.totalItems - 1),
    });
  }),



  on(ShipActions.externalShipUpdate, (state, {extShipUpdateDto}) => {
    console.log('[Reducer] EXTERNAL UPDATE ship');

    const merged = mergeSocketFillEmptyStatics(extShipUpdateDto as ShipStatusPatch, state.entities[extShipUpdateDto.id]);

    return adapter.upsertOne(merged, state);

  }),

  on(ShipActions.externalShipsUpsert, (state, {extShipsUpsertDto}) => {
    console.log('[Reducer] EXTERNAL UPSERT ships');

      const filtered = state.recentlyDeletedId
      ? extShipsUpsertDto.filter(s => s.id !== state.recentlyDeletedId)
      : extShipsUpsertDto;

      const merged: IShipStatusDto[] = filtered.map(s =>
      mergeSocketFillEmptyStatics(s as ShipStatusPatch, state.entities[s.id])
    );

    return adapter.upsertMany(merged, state);

  }),



  on(ShipActions.loadAllShips, (state,) => ({
    ...state,
    isLoading: true

  })),


  on(ShipActions.loadAllShipsSuccess, (state, {ships}) => {
    return adapter.setAll(ships, {
      ...state,
      isLoading: false
    });
  }),


  on(ShipActions.loadAllShipsFailure, (state) => ({
    ...state,
    isLoading: false
  })),


  on(ShipActions.loadPaginatedShips, (state) => ({
    ...state,
    isLoading: true,
    error: undefined,

  })),


  on(ShipActions.loadPaginatedShipsSuccess, (state, {ships, page, pageSize, totalPages, totalItems, sort, direction}) => {

    const mergedState: IShipStatusDto[] = ships.map(s => mergePagedIntoStatus(s, state.entities[s.id]));
    const currentPageIds = ships.map(s => s.id);


    return adapter.upsertMany(mergedState, {
      ...state,
      isLoading: false,
      error: undefined,
      page,
      pageSize,
      totalPages,
      totalItems,
      sort,
      direction,
      currentPageIds,

    });

  }),


  on(ShipActions.loadPaginatedShipsFailure, (state, {error}) => ({
    ...state,
    isLoading: false,
    error,

  })),


  on(ShipActions.loadShipSuccess, (state, {ship}) => {
    console.log('[Reducer] LOAD ship success:', ship);
    return adapter.upsertOne(ship, state);
  }),

  //new
  on(ShipActions.reloadCurrentPage, state => ({
    ...state,
    updateCooldownUntil: {},
  })),


  on(ShipActions.setAddedShipId, (state, {idTrack}) => ({
    ...state,
    newlyAddedShipId: idTrack
  })),

  on(ShipActions.setUpdatedShipId, (state, {editedShipId}) => ({
    ...state,
    editedShipId: editedShipId,
    editedShipAt: editedShipId ? Date.now() : null,

  })),


  on(ShipActions.setDeletedId, (state, {idTrack}) => ({
    ...state,
    newlyAddedShipId: null,
    recentlyDeletedId: idTrack
  })),

  on(ShipActions.updateShip, (state, {id, updateDto}) =>{
    return adapter.updateOne(
      {
        id,
        changes: {
          name: updateDto.name,
          hostAddr: updateDto.hostAddr,
        },
      },
    state,
    );
  }),



  on(ShipActions.updateShipSuccess, (state, {updatedShip}) => {
    console.log('[Reducer] UPDATE ship success:', updatedShip);
    return adapter.upsertOne(updatedShip, state);
  }),


  on(ShipActions.upsertManyShips, (state, {ships}) => {
        const mergedState = ships.map(s => {
          const existing = state.entities[s.id];

          if (state.editedShipId === s.id && existing) {
            return existing;
          }

          return mergePagedIntoStatus(s, state.entities[s.id]);

        }).filter((x): x is IShipStatusDto => !!x);

        return adapter.upsertMany(mergedState, state);
    }),
);

