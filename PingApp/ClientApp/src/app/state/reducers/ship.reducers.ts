import {createReducer, on,} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {IShipModel, IShipResult, ShipDto} from '../../services/api/pingapp-api.service';
import * as ShipActions from '../actions/ship.actions';


export interface ShipState extends EntityState<IShipResult> {
  aShipModel: IShipModel[];
  editedShipId: string | null;
  error: unknown | null;
  isLoading: boolean;
  loading: boolean;
  newlyAddedShipId: string | null;
  pageSize: number;
  page: number;
  recentlyDeletedId: string | null;
  ships: ShipDto[];
  sort: string;
  direction: string;
  totalPages: number;
  totalItems: number;

}

export const adapter: EntityAdapter<IShipResult> =
  createEntityAdapter<IShipResult>({
    selectId: (s) => s.id,
    sortComparer: (sa, sb) => sa.name.localeCompare(sb.name),
  });

export const initialState: ShipState = adapter.getInitialState({

  aShipModel: [],
  //currentPage: = page,
  editedShipId: null,
  error: undefined,
  isLoading: false,
  loading: false,
  newlyAddedShipId: null,
  page: 1,
  pageSize: 12,
  recentlyDeletedId: null,
  ships: [],
  sort: 'name',
  direction: 'desc',
  totalPages: 1,
  totalItems: 0,

});

export const shipReducer = createReducer(
  initialState,

  on(ShipActions.deleteShipSuccess, (state, {id}) => {
    console.log('[Reducer] delete ship success', id);
    const newShips = state.ships.filter(s => s.id !== id);

    return {
      ...state,
      ships: newShips,
      totalItems: Math.max(state.totalItems - 1, 0)
    };
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
    loading: true,
    error: undefined,

  })),
  on(ShipActions.loadPaginatedShipsSuccess, (state, a) => ({
    ...state,
    ships: a.ships,
    loading: false,
    page: a.page,
    totalPages: a.totalPages,
    totalItems: a.totalItems,
    pageSize: a.pageSize ?? state.pageSize,
    sort: a.sort,
    direction: a.direction

  })),
  on(ShipActions.loadPaginatedShipsFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error

  })),


  on(ShipActions.loadShipSuccess, (state, {ship}) => {
    console.log('[Reducer] load ship success:', ship);
    return adapter.upsertOne(ship, state);
  }),


  on(ShipActions.registerShipSuccess, (state, {newShip}) => {
    console.log('[Reducer] register ship success:', newShip);
    return adapter.upsertOne(newShip, state);
  }),


  on(ShipActions.setAddedShipId, (state, {idTrack}) => ({
    ...state,
    newlyAddedShipId: idTrack
  })),

  on(ShipActions.setEditedShipId, (state, {idEdit}) => ({
    ...state,
    editedShipId: idEdit
  })),


  on(ShipActions.setRecentlyDeletedId, (state, {idTrack}) => ({
    ...state,
    newlyAddedShipId: null,
    recentlyDeletedId: idTrack
  })),


  on(ShipActions.updateShipSuccess, (state, {editShip}) => {
    console.log('[Reducer] update ship success:', editShip);
    return adapter.upsertOne(editShip, state);
  }),


  on(ShipActions.upsertManyShips, (state, {ships}) => {
    // console.log('[Reducer] upserting ships:', ships.map(s => s.id));
    const filtered = ships.filter(s => s.id !== state.recentlyDeletedId);
    return adapter.upsertMany(filtered, state);
  }),
);

