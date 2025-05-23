import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {IShipModel, IShipResult} from '../../services/api/pingapp-api.service';
import * as ShipActions from '../actions/ship.actions';
import {loadShipSuccess, registerShip, registerShipSuccess} from '../actions/ship.actions';

export interface ShipState extends EntityState<IShipResult> {}

export const adapter: EntityAdapter<IShipResult> =
  createEntityAdapter<IShipResult>({
    selectId: (s) => s.id,
    sortComparer: (sta, stb) => sta.name.localeCompare(stb.name),
  });

export const initialState: ShipState = adapter.getInitialState();

export const shipReducer = createReducer(
  initialState,


  on(registerShipSuccess, (state, { newShip }) => {
    console.log('[Reducer] register ship success:', newShip);
    return adapter.upsertOne(newShip, state);
  }),


  on(loadShipSuccess, (state, { ship }) => {
    console.log('[Reducer] load ship success:', ship);
    return adapter.upsertOne(ship, state);
  }),



  on(ShipActions.upsertManyShips, (state, { ships }) => {
    return adapter.upsertMany(ships, state);
  }),


  on(ShipActions.loadAllShipsSuccess, (state, { ships }) => {
    return adapter.setAll(ships, state);
  }),

);

// get the selectors
const { selectIds, selectAll } = adapter.getSelectors();

// export const registerShip

export const selectShipState = createFeatureSelector<ShipState>('ships');


export const selectDbShipById = (id:string) => createSelector(selectShipState, (state) => {const ship = state.entities[id];
  if (!ship) return null;
  const { name, hostAddr } = ship;
  return { id, name, hostAddr } as IShipModel;
});

// select the array of users
export const selectAllShips = createSelector(selectShipState, selectAll);

export const selectAllDbShips = createSelector(selectAllShips, (ships): IShipModel[] => ships.map(({ id, name, hostAddr }) => ({ id, name, hostAddr })));

// export const selectRegisterShipStatus = createSelector()

// export const updateShip = createSelector(selectId, selectShip);


// export const selectAllShipsSorted = () =>
//   createSelector(selectAllShips, (ships) => {
//     return ships.sort((a, b) => a.id - b.id);
//   });
