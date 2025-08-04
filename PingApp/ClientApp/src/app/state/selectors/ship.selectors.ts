import {createFeatureSelector, createSelector} from '@ngrx/store';
import {IShipModel, ShipResult} from '../../services/api/pingapp-api.service';
import {adapter, ShipState} from '../reducers/ship.reducers';

const { selectAll } = adapter.getSelectors();


export const selectShipState = createFeatureSelector<ShipState>('ships');


export const selectAllShips = createSelector(selectShipState, selectAll);

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

export const selectShips = createSelector(selectShipState, s => s.ships);
export const selectPage = createSelector(selectShipState, s => s.page);
//export const selectCurrentPage = createSelector(selectShipState, s => s.currentPage);

export const selectPageSize = createSelector(selectShipState, s => s.pageSize);

export const selectSortBy = createSelector(selectShipState, s => s.sortBy)

export const selectSortDirection = createSelector(selectShipState, s => s.sortDir);

export const selectTotalPages = createSelector(selectShipState, s => s.totalPages);
export const selectTotalItems = createSelector(selectShipState, s => s.totalItems);
export const selectLoading = createSelector(selectShipState, s => s.loading);

export const selectPaginatedShipViewModel = createSelector(
  selectShips,
  selectPage,
  selectTotalPages,
  selectTotalItems,
  selectLoading,
  (ships, page, totalPages,totalItems, loading) => ({
    ships,
    page,
    totalPages,
    totalItems,
    loading
  })
);
