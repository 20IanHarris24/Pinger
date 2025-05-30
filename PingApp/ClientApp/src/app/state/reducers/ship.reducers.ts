import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {IShipModel, IShipResult} from '../../services/api/pingapp-api.service';
import {
  deleteShip, loadAllShips, loadAllShipsFailure,
  loadAllShipsSuccess,
  loadShipSuccess,
  registerShipSuccess,
  setAddedShipId,
  setEditedShipId, upsertManyShips
} from '../actions/ship.actions';

export interface ShipState extends EntityState<IShipResult> {
  aShipModel: IShipModel[];
  newlyAddedShipId: string | null;
  editedShipId: string | null;
  isLoading: boolean;

}

export const adapter: EntityAdapter<IShipResult> =
  createEntityAdapter<IShipResult>({
    selectId: (s) => s.id,
    sortComparer: (sa, sb) => sa.name.localeCompare(sb.name),
  });

export const initialState: ShipState = adapter.getInitialState({

  aShipModel: [],
  newlyAddedShipId: null,
  editedShipId: null,
  isLoading: false


});

export const shipReducer = createReducer(
  initialState,

  on(deleteShip, (state, { id }) => {
    return adapter.removeOne(id, state);
  }),

  on(loadShipSuccess, (state, { ship }) => {
    console.log('[Reducer] load ship success:', ship);
    return adapter.upsertOne(ship, state);
  }),


  on(loadAllShips, (state, ) => ({
    ...state,
    isLoading: true

  })),

  // on(loadAllShipsSuccess, (state, { ships }) => {
  //   console.log('[Reducer] load all ships success payload:', ships.map(s => s.id));
  //   return adapter.setAll(ships, state);
  // }),

  on(loadAllShipsSuccess, (state, { ships }) => {
    return adapter.setAll(ships, {
      ...state,
      isLoading: false
      });
  }),

  on(loadAllShipsFailure, (state) => ({
    ...state,
    isLoading: false
  })),


  on(registerShipSuccess, (state, { newShip }) => {
    console.log('[Reducer] register ship success:', newShip);
    return adapter.upsertOne(newShip, state);
  }),


  on(setAddedShipId, (state, { idTrack }) => ({
    ...state,
    newlyAddedShipId: idTrack
  })),

  on(setEditedShipId, (state,{ idEdit }) => ({
    ...state,
    editedShipId: idEdit
  })),


  on(upsertManyShips, (state, { ships }) => {
    return adapter.upsertMany(ships, state);
  }),

);




// get the SELECTORS
const { selectAll } = adapter.getSelectors();
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

export const selectNewlyAddedShipId = createSelector(
  selectShipState,
  (state: ShipState) => state.newlyAddedShipId
);

export const selectShipsLoading = createSelector(
  selectShipState,
  (state: ShipState) => state.isLoading
);


// export const selectAllShipsSorted = () =>
//   createSelector(selectAllShips, (ships) => {
//     return ships.sort((a, b) => a.id - b.id);
//   });
