import {createReducer, on,} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {IShipModel, IShipResult, ShipDto, ShipResult} from '../../services/api/pingapp-api.service';
import * as ShipActions from '../actions/ship.actions';



export interface ShipState extends EntityState<IShipResult> {
  aShipModel: IShipModel[];
  //currentPage: number;
  editedShipId: string | null;
  error?: any;
  isLoading: boolean;
  loading: boolean;
  newlyAddedShipId: string | null;
  pageSize: number;
  page: number;
  recentlyDeletedId: string | null;
  ships: ShipDto[];
  sortBy: string;
  sortDir: string;
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
  isLoading: false,
  loading: false,
  newlyAddedShipId: null,
  page: 1,
  pageSize:21,
  recentlyDeletedId: null,
  ships: [],
  sortBy: 'name',
  sortDir: 'asc',
  totalPages: 1,
  totalItems: 0,

});

export const shipReducer = createReducer(
  initialState,

  // on(ShipActions.deleteShipSuccess, (state, { id }) => {
  //   console.log('[Reducer] delete ship success',id);
  //   return adapter.removeOne(id, {
  //     ...state,
  //     isLoading: false
  //   });
  // }),

  on(ShipActions.deleteShipSuccess, (state, { id }) => {
    console.log('[Reducer] delete ship success',id);
    const newShips = state.ships.filter(s => s.id !== id);

   return {
      ...state,
      ships: newShips,
      totalItems: Math.max(state.totalItems - 1, 0)
    };
  }),

  on(ShipActions.loadAllShips, (state, ) => ({
    ...state,
    isLoading: true

  })),


  on(ShipActions.loadAllShipsSuccess, (state, { ships }) => {
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
    loading: true
  })),
  on(ShipActions.loadPaginatedShipsSuccess, (state, { ships, page, totalPages, totalItems, sort = 'name', direction = 'asc', size }) => ({
    ...state,
    ships,
    page,
    totalPages,
    totalItems,
    pageSize: size ?? state.pageSize,
    sortBy: sort,
    sortDir: direction,
    loading: false
  })),
  on(ShipActions.loadPaginatedShipsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),



  on(ShipActions.loadShipSuccess, (state, { ship }) => {
    console.log('[Reducer] load ship success:', ship);
    return adapter.upsertOne(ship, state);
  }),



  on(ShipActions.registerShipSuccess, (state, { newShip }) => {
    console.log('[Reducer] register ship success:', newShip);
    return adapter.upsertOne(newShip, state);
  }),


  on(ShipActions.setAddedShipId, (state, { idTrack }) => ({
    ...state,
    newlyAddedShipId: idTrack
  })),

  on(ShipActions.setEditedShipId, (state,{ idEdit }) => ({
    ...state,
    editedShipId: idEdit
  })),


  on(ShipActions.setRecentlyDeletedId, (state, { idTrack }) => ({
    ...state,
    newlyAddedShipId: null,
    recentlyDeletedId: idTrack
  })),



on(ShipActions.updateShipSuccess, (state, {editShip}) =>{
    console.log('[Reducer] update ship success:', editShip);
    return adapter.upsertOne(editShip, state);
  }),


  on(ShipActions.upsertManyShips, (state, { ships }) => {
    // console.log('[Reducer] upserting ships:', ships.map(s => s.id));
    const filtered = ships.filter(s => s.id !== state.recentlyDeletedId);
    return adapter.upsertMany(filtered, state);
  }),

);



// get the SELECTORS
// const { selectAll } = adapter.getSelectors();
//
//
// export const selectShipState = createFeatureSelector<ShipState>('ships');
//
//
// export const selectAllShips = createSelector(selectShipState, selectAll);
//
// export const selectDbShipById = (id:string) => createSelector(selectShipState, (state) => {const ship = state.entities[id];
//   if (!ship) return null;
//   const { name, hostAddr } = ship;
//   return { id, name, hostAddr } as IShipModel;
// });
//
// export const selectEditedShipId = createSelector(
//   selectShipState,
//   (state: ShipState) => state.editedShipId
//
// );
//
// export const selectByTest = (id: string) =>
//   createSelector(selectShipState, (state) => state.entities[id] as ShipResult | undefined);
//
// export const selectNewlyAddedShipId = createSelector(
//   selectShipState,
//   (state: ShipState) => state.newlyAddedShipId
// );
//
// export const selectShips = createSelector(selectShipState, s => s.ships);
// export const selectPage = createSelector(selectShipState, s => s.page);
// //export const selectCurrentPage = createSelector(selectShipState, s => s.currentPage);
//
// export const selectPageSize = createSelector(selectShipState, s => s.pageSize);
//
// export const selectSortBy = createSelector(selectShipState, s => s.sortBy)
//
// export const selectSortDirection = createSelector(selectShipState, s => s.sortDir);
//
// export const selectTotalPages = createSelector(selectShipState, s => s.totalPages);
// export const selectTotalItems = createSelector(selectShipState, s => s.totalItems);
// export const selectLoading = createSelector(selectShipState, s => s.loading);
//
// export const selectPaginatedShipViewModel = createSelector(
//   selectShips,
//   selectPage,
//   selectTotalPages,
//   selectTotalItems,
//   selectLoading,
//   (ships, page, totalPages,totalItems, loading) => ({
//     ships,
//     page,
//     totalPages,
//     totalItems,
//     loading
//   })
// );

