import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { IShipResult } from '../../services/api/pingapp-api.service';
import * as ShipActions from '../actions/ship.actions';

export interface ShipState extends EntityState<IShipResult> {}

export const adapter: EntityAdapter<IShipResult> =
  createEntityAdapter<IShipResult>({
    selectId: (s) => s.id,
    sortComparer: (sta, stb) => sta.name.localeCompare(stb.name),
  });

export const initialState: ShipState = adapter.getInitialState();

export const shipReducer = createReducer(
  initialState,
  on(ShipActions.upsertManyShips, (state, { ships }) => {
    return adapter.upsertMany(ships, state);
  })
);

// get the selectors
const { selectIds, selectAll } = adapter.getSelectors();

export const selectShipState = createFeatureSelector<ShipState>('ships');

// select the array of ship ids
export const selectShipNames = createSelector(selectShipState, selectIds);

// select the array of users
export const selectAllShips = createSelector(selectShipState, selectAll);

// export const selectAllShipsSorted = () =>
//   createSelector(selectAllShips, (ships) => {
//     return ships.sort((a, b) => a.id - b.id);
//   });
