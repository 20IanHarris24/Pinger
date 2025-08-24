import {createFeatureSelector, createSelector} from '@ngrx/store';
import {IShipModel, ShipDto, ShipResult} from '../../services/api/pingapp-api.service';
import {adapter, ShipState} from '../reducers/ship.reducers';

const {selectAll} = adapter.getSelectors();


export const selectShipState = createFeatureSelector<ShipState>('ships');


export const selectAllShips = createSelector(selectShipState, selectAll);

export const selectDbShipById = (id: string) => createSelector(selectShipState, (state) => {
  const ship = state.entities[id];
  if (!ship) return null;
  const {name, hostAddr} = ship;
  return {id, name, hostAddr} as IShipModel;
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

export interface PaginatedViewModel {
  ships: ShipDto[];
  page: number;
  totalPages: number;
  totalItems: number;
  loading: boolean;
}

export const selectPaginatedShipViewModel = createSelector(
  selectShips,
  selectPage,
  selectTotalPages,
  selectTotalItems,
  selectLoading,
  (ships, page, totalPages, totalItems, loading): PaginatedViewModel => ({
    ships,
    page,
    totalPages,
    totalItems,
    loading
  })
);


export type PaginationModel = Pick<PaginatedViewModel, 'page' | 'totalPages' | 'totalItems'>;

export const selectPaginationModel = createSelector(
  selectPaginatedShipViewModel,
  ({page, totalPages, totalItems}): PaginationModel => ({page, totalPages, totalItems})
);











