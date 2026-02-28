import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, concatMap, delay, from, map, mergeMap, of, switchMap, tap, withLatestFrom} from 'rxjs';
import { inject, Injectable} from '@angular/core';
import * as ShipActions from '../actions/ship.actions'
import * as ShipSelectors from '../selectors/ship.selectors';
import {IShipStatusDto, ShipDto, ShipsClient, ShipStatusDto} from '../../services/api/pingapp-api.service';
import { Store } from '@ngrx/store';
import { ShipDeleteService } from '../../services/ship.delete.service';


@Injectable()
export class ShipEffects {

  private actions$ = inject(Actions);
  private client = inject(ShipsClient);
  private deleteState = inject(ShipDeleteService);
  private store = inject(Store);

  /* @Effect */

  clearAddedShipId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.setAddedShipId),
      delay(3000),
      map(() => ShipActions.setAddedShipId({idTrack: null}))
    )
  );

  createShip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.createShip),
      tap(() => console.log('[Effect] createShip$ fired')),
      concatMap(({ createNewShipDto }) =>
        this.client.registerShip(createNewShipDto).pipe(
          map((response) => {
            const enrichedShip = {
              id: response.id,
              name: response.name,
              hostAddr: response.hostAddr,
              result: 'Unknown',
            } satisfies IShipStatusDto;

            return ShipActions.createShipSuccess({ createNewShipSuccess: enrichedShip });
          }),
          catchError((error) => of(ShipActions.createShipFailure({ error })))
        )
      )
    )
  );

  clearEditedShipId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.setUpdatedShipId),
      delay(3000),
      map(() => ShipActions.setUpdatedShipId({editedShipId: null}))
    )
  );


  createShipSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.createShipSuccess),
      mergeMap(({createNewShipSuccess}) => [
        ShipActions.setAddedShipId({idTrack: createNewShipSuccess.id}),
        ShipActions.reloadCurrentPage(),
      ])
    )
  );



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
            setTimeout(() => this.deleteState.reset(), 1500);
          }),
          switchMap(() => [
            ShipActions.deleteShipSuccess({id}),
            ShipActions.setDeletedId({idTrack: id}),
            ShipActions.reloadCurrentPage(),
          ]),
          catchError((error) => {
            console.error('[Effect] deleteShip error:', error);
            //this.deleteState.setError('');
            this.deleteState.setError(error?.message || 'Unexpected error.');
            return of(ShipActions.deleteShipFailure({error}));
          })
        )
      )
    )
  );



  loadAllShips$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.loadAllShips),
      tap(() => {
        console.log('[Effect] loadAllShips$ fired')

      }),
      switchMap(() =>
        this.client.getAllShips().pipe(
          map((ships) => {
            const enrichedShips: IShipStatusDto[] = ships.map((ship) => ({
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
      tap(({ page }) => console.log('[Effect] loadPaginatedShips page=', page)),
      switchMap(({page}) =>
        this.client.getPaginationResult(page).pipe(
          tap(res => console.log('[Effect] API response:', res)),
          map(response => ShipActions.loadPaginatedShipsSuccess({
            ships: response.data,
            page: response.pageNumber,
            pageSize: response.pageSize,
            totalPages: response.totalPages,
            totalItems: response.totalCount,
            sort: response.sort,
            direction: response.direction,

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
          map((ship: ShipDto) => {
            const enrichedShip: IShipStatusDto =
              {
                ...ship,
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






  reloadCurrentPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.reloadCurrentPage),
      withLatestFrom(this.store.select(ShipSelectors.selectPage)),
      map(([_, page]) => ShipActions.loadPaginatedShips({ page }))
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
            const shipResultInstance = ShipStatusDto.fromJS(response);
            shipResultInstance.result = existingShip?.result ?? 'Unknown';


            return from([
              ShipActions.updateShipSuccess({updatedShip: shipResultInstance}),
              ShipActions.reloadCurrentPage(),
            ]);
          }),
          catchError(error =>
            from([
              ShipActions.updateShipFailure({error}),
              ShipActions.reloadCurrentPage(),
           ])
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
      mergeMap(({updatedShip}) => [
        ShipActions.setUpdatedShipId({editedShipId: updatedShip.id}),
      ])
    )
  );

}
