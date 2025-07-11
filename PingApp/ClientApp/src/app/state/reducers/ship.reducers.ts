import {createFeatureSelector, createReducer, createSelector, on,} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {IShipModel, IShipResult, ShipResult} from '../../services/api/pingapp-api.service';
import * as ShipActions from '../actions/ship.actions';


export interface ShipState extends EntityState<IShipResult> {
  aShipModel: IShipModel[];
  editedShipId: string | null;
  isLoading: boolean;
  newlyAddedShipId: string | null;
  recentlyDeletedId: string | null;

}

export const adapter: EntityAdapter<IShipResult> =
  createEntityAdapter<IShipResult>({
    selectId: (s) => s.id,
    sortComparer: (sa, sb) => sa.name.localeCompare(sb.name),
  });

export const initialState: ShipState = adapter.getInitialState({

  aShipModel: [],
  editedShipId: null,
  isLoading: false,
  newlyAddedShipId: null,
  recentlyDeletedId: null

});

export const shipReducer = createReducer(
  initialState,

  on(ShipActions.deleteShipSuccess, (state, { id }) => {
    console.log('[Reducer] delete ship success',id);
    return adapter.removeOne(id, {
      ...state,
      isLoading: false
    });
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
const { selectAll } = adapter.getSelectors();


export const selectDeletedId = (id:string) => createSelector(selectShipState, (state: ShipState) => state.recentlyDeletedId);


export const selectShipState = createFeatureSelector<ShipState>('ships');


export const selectAllShips = createSelector(selectShipState, selectAll);

// export const selectAllDbShips = createSelector(
//   selectAllShips, (ships): IShipModel[] => ships.map(({ id, name, hostAddr }) => ({ id, name, hostAddr })));
export const selectDbShipById = (id:string) => createSelector(selectShipState, (state) => {const ship = state.entities[id];
  if (!ship) return null;
  const { name, hostAddr } = ship;
  return { id, name, hostAddr } as IShipModel;
});

export const selectEditedShipId = createSelector(
  selectShipState,
  (state: ShipState) => state.editedShipId

);

export const selectByTest = (id: string) =>
  createSelector(selectShipState, (state) => state.entities[id] as ShipResult | undefined);

export const selectNewlyAddedShipId = createSelector(
  selectShipState,
  (state: ShipState) => state.newlyAddedShipId
);



// export const selectShipsLoading = createSelector(
//   selectShipState,
//   (state: ShipState) => state.isLoading
// );

// export const selectAllShipsSorted = () =>
//   createSelector(selectAllShips, (ships) => {
//     return ships.sort((a, b) => a.id - b.id);
//   });
