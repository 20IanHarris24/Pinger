import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, delay, from, map, mergeMap, of, switchMap, tap, withLatestFrom} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import * as ShipActions from '../actions/ship.actions'
import * as ShipSelectors from '../selectors/ship.selectors';
import {IShipResult, ShipModel, ShipResult, ShipsClient} from '../../services/api/pingapp-api.service';
import {Store} from '@ngrx/store';
import {ShipDeleteService} from '../../services/ship.delete.service';


@Injectable()
export class ShipEffects {

  private actions$ = inject(Actions);
  private client = inject(ShipsClient);
  private deleteState = inject(ShipDeleteService);
  private store = inject(Store);

  /* @Effect */
  deleteShip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.deleteShip),
      tap(() => {
        console.log('[Effect] deleteShip$ fired');
        this.deleteState.markDeleting();
        this.deleteState.setError('');
      }),
      switchMap(({id}) =>
        this.client.deleteShip(id).pipe(
          tap(() => {
            console.log('[Effect] deleteShip$ success');
            this.deleteState.markSuccess();
          }),
          switchMap(() => [
            ShipActions.deleteShipSuccess({id}),
            ShipActions.setRecentlyDeletedId({idTrack: id}),
            ShipActions.reloadCurrentPage()
          ]),
          catchError((error) => {
            console.error('[Effect] deleteShip error:', error);
            this.deleteState.setError('');
            this.deleteState.setError(error?.message || 'Unexpected error.');
            return of(ShipActions.deleteShipFailure({error}));
          })
        )
      )
    )
  );


  /* @Effect */
  loadAllShips$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.loadAllShips),
      tap(() => {
        console.log('[Effect] loadAllShips$ fired')

      }),
      switchMap(() =>
        this.client.getAllShips().pipe(
          map((ships) => {
            const enrichedShips: IShipResult[] = ships.map((ship) => ({
              ...ship,
              result: ''
            }));

            return ShipActions.loadAllShipsSuccess({ships: enrichedShips});
          }),
          catchError((error) => of(ShipActions.loadAllShipsFailure({error})))
        )
      )
    )
  );

  loadAllShipsSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ShipActions.loadAllShipsSuccess),
        tap((ships) => {
          console.log('[Effect] loadAllShipsSuccess$ fired and API returned ships: ', ships);
        })
      ),
    {dispatch: false}
  );


  loadPaginatedShips$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.loadPaginatedShips),
      switchMap(({page}) =>
        this.client.getPaginationResult(page).pipe(
          map(res => ShipActions.loadPaginatedShipsSuccess({
            ships: res.data,
            page: res.pageNumber,
            pageSize: res.pageSize,
            totalPages: res.totalPages,
            totalItems: res.totalCount,
            sort: res.sort,
            direction: res.direction,

          })),
          catchError(error => of(ShipActions.loadPaginatedShipsFailure({error})))
        )
      )
    )
  );


  loadShip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.loadShip),
      tap(() => {
        console.log('[Effect] loadShip$ fired')
      }),
      switchMap(({id}) =>
        this.client.getShipById(id).pipe(
          map((ship: ShipModel) => {
            const enrichedShip: IShipResult =
              {
                ...ship.toJSON(),
                result: ''
              };
            console.log('[Effect] Enriched ship:', enrichedShip);
            return ShipActions.loadShipSuccess({ship: enrichedShip});
          }),
          tap(() => {
            console.log('[Error] No enriched ship found')
          }),
          catchError((error) => of(ShipActions.loadShipFailure({error})))
        )
      )
    )
  );

  loadShipSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ShipActions.loadShipSuccess),
        tap(() => {
          console.log('[Effect] loadShipSuccess$ fired');
        })
      ),
    {dispatch: false}
  );


  registerShip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.registerShip),
      tap(() => {
        console.log('[Effect] registerShip$ fired');
      }),
      switchMap(({newShipDto}) =>
        this.client.registerShip(newShipDto).pipe(
          map((response) => ShipActions.registerShipSuccess({newShip: response})),
          tap(() => {
            console.log('[Error] No ship registered')
          }),


          catchError((error) => of(ShipActions.registerShipFailure({error})))
        )
      )
    )
  );

  registerShipSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.registerShipSuccess),
      mergeMap(({newShip}) => [
        // ShipActions.loadAllShips(),
        ShipActions.setAddedShipId({idTrack: newShip.id}),
        ShipActions.reloadCurrentPage()
      ])
    )
  );


  // ship.effects.ts
  reloadCurrentPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.reloadCurrentPage),
      withLatestFrom(
        this.store.select(ShipSelectors.selectPage),
        // this.store.select(ShipSelectors.selectPageSize),
        // this.store.select(ShipSelectors.selectSort),
        // this.store.select(ShipSelectors.selectDirection),
      ),
      map(([_, page]) =>
        ShipActions.loadPaginatedShips({page})
      )
    )
  );


  clearAddedShipId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.setAddedShipId),
      delay(3000),
      map(() => ShipActions.setAddedShipId({idTrack: null}))
    )
  );

  updateShip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.updateShip),
      tap(() => console.log('[Effect] updateShip$ fired')),
      mergeMap(({id, updateDto}) =>
        this.client.updateShipModel(id, updateDto).pipe(
          withLatestFrom(this.store.select(ShipSelectors.selectByTest(id))),
          mergeMap(([response, existingShip]) => {
            const shipResultInstance = ShipResult.fromJS(response);
            shipResultInstance.result = existingShip?.result ?? 'Unknown';


            return from([
              ShipActions.updateShipSuccess({editShip: shipResultInstance}),
              ShipActions.reloadCurrentPage()
            ]);
          }),
          catchError(error =>
            of(ShipActions.updateShipFailure({error}))
          )
        )
      )
    )
  );


  updateShipSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.updateShipSuccess),
      tap(() => {
        console.log('[Effect] updateShipSuccess$ fired');
      }),
      mergeMap(({editShip}) => [
        ShipActions.loadAllShips(),
        ShipActions.setEditedShipId({idEdit: editShip.id}),
      ])
    )
  );


  clearEditedShipId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.setEditedShipId),
      delay(3000),
      map(() => ShipActions.setEditedShipId({idEdit: null}))
    )
  );

}
