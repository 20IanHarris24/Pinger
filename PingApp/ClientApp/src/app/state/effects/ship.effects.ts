import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, of, switchMap, tap} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {
  deleteShip,
  deleteShipFailure,
  deleteShipSuccess,
  loadAllShips,
  loadAllShipsFailure,
  loadAllShipsSuccess,
  loadShip,
  loadShipFailure,
  loadShipSuccess,
  registerShip, registerShipFailure, registerShipSuccess,
  updateShip,
  updateShipFailure,
  updateShipSuccess
} from '../actions/ship.actions';
import {IShipResult, ShipModel, ShipsClient, ShipUpdateDto} from '../../services/api/pingapp-api.service';
import {ButtonFunctionService} from '../../services/button.function.service';


@Injectable()
export class ShipEffects {

  private actions$ = inject(Actions);
  private buttonService = inject(ButtonFunctionService);
  private client = inject(ShipsClient)

  /* @Effect */
  deleteShip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteShip),
      tap(() => {
        console.log('[Effect] deleteShip$ fired')
        this.buttonService._deleteStatus$.next('loading');
        this.buttonService._deleteErrorMessage$.next('');
      }),
      switchMap(({ id }) =>
        this.client.deleteShip(id).pipe(
          tap(()=>{
            this.buttonService._deleteStatus$.next('success');
          }),
          map(() => deleteShipSuccess()),
          catchError((error) => {
            console.error('[Effect] deleteShip error:', error);
            this.buttonService._deleteStatus$.next('error');
            this.buttonService._deleteErrorMessage$.next(
              error?.message || 'Unexpected error.'
            );
            return of(deleteShipFailure({error}));
          })
        )
      )
    )
  );

  /* @Effect */
  deleteShipSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteShipSuccess),
      tap(() => {
        console.log('[Effect] deleteShipSuccess$ fired')

      }),
      map(() => loadAllShips())
   )
  );

  /* @Effect */
  loadAllShips$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAllShips),
      tap(() => {
        console.log('[Effect] loadAllShips$ fired')

      }),
      switchMap(() =>
        this.client.getAllShips().pipe(
          map((ships) => {
            const enrichedShips: IShipResult[] = ships.map((ship) => ({
              ...ship,
              result: '' // dummy
            }));

            return loadAllShipsSuccess({ships: enrichedShips});
          }),
          catchError((error) => of(loadAllShipsFailure({ error })))
        )
      )
    )
  );

  loadShip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadShip),
      tap(() => {
        console.log('[Effect] loadShip$ fired')
       }),
      switchMap(({ id }) =>
        this.client.getShipByShipId(id).pipe(
          map((ship: ShipModel) => {
            const enrichedShip: IShipResult =
              {
              ...ship.toJSON(),
              result: ''
            };
            console.log('[Effect] Enriched ship:', enrichedShip);
            return loadShipSuccess({ship: enrichedShip});
          }),
          tap(() => {
            console.log('[Error] No enriched ship found')
          }),
           catchError((error) => of(loadShipFailure({ error })))
        )
      )
    )
  );

  loadShipSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadShipSuccess),
      tap(() => {
        console.log('[Effect] loadShipSuccess$ fired');
      })
    ),
    { dispatch: false }
  );


  registerShip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerShip),
      tap(() => {
        console.log('[Effect] registerShip$ fired');
      }),
      switchMap(({ newShipDto }) =>
        this.client.registerShip(newShipDto).pipe(
          map((response) => registerShipSuccess({ newShip: response })),
          tap(() => {
            console.log('[Error] No ship registered')
          }),


          catchError((error) => of(registerShipFailure({ error })))
        )
      )
    )
  );

  registerShipSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerShipSuccess),
      map(() => loadAllShips())
    )
  );







  updateShip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateShip),
      tap(() => {
        console.log('[Effect] updateShip$ fired');
      }),
      switchMap(({ id, updateDto }) =>
        this.client.updateShipModel(id, updateDto).pipe(
          map(() => updateShipSuccess()),
          tap(() => {
            console.log('[Effect] updateShipSuccess dispatched');
          }),
          catchError((error) => {
            console.log('[Error] Ship update failed');
            return of(updateShipFailure({ error }));
          })
        )
      )
    )
  );


  updateShipSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(updateShipSuccess),
        map(() => loadAllShips()),
        tap(() => {
          console.log('[Effect] updateShipSuccess$ fired');
        })
      ),
  );


}


