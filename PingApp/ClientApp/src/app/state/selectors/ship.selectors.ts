import {createFeatureSelector, createSelector} from '@ngrx/store';
import {IShipModel, ShipDto, ShipResult} from '../../services/api/pingapp-api.service';
import {adapter, ShipState} from '../reducers/ship.reducers';
import {IPaginatedViewModel} from '../../ts_models/pagination.model';

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

export const selectDirection = createSelector(selectShipState, s => s.direction);
// export const selectError     = createSelector(selectShipState, s => s.error);
export const selectLoading = createSelector(selectShipState, s => s.loading);
export const selectPage = createSelector(selectShipState, s => s.page);
export const selectShips = createSelector(selectShipState, s => s.ships);
//export const selectCurrentPage = createSelector(selectShipState, s => s.currentPage);
export const selectPageSize = createSelector(selectShipState, s => s.pageSize);
export const selectSort = createSelector(selectShipState, s => s.sort)
export const selectTotalPages = createSelector(selectShipState, s => s.totalPages);
export const selectTotalItems = createSelector(selectShipState, s => s.totalItems);


export const selectPaginatedShipViewModel = createSelector(
  selectShips,
  selectLoading,
  selectPage,
  selectPageSize,
  selectTotalPages,
  selectTotalItems,
  selectSort,
  selectDirection,
  (ships, loading, page, pageSize, totalPages, totalItems, sort, direction): IPaginatedViewModel => ({
    ships,
    loading,
    page,
    pageSize,
    totalPages,
    totalItems,
    sort,
    direction,
  })
);


export type PaginationModel = Pick<IPaginatedViewModel, 'page' | 'totalPages' | 'totalItems'>;

export const selectPaginationModel = createSelector(
  selectPaginatedShipViewModel,
  ({page, totalPages, totalItems}): PaginationModel => ({page, totalPages, totalItems})
);











