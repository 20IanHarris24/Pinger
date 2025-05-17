import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, of, switchMap, tap} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {
  deleteShip,
  deleteShipFailure,
  deleteShipSuccess,
  loadAllShips, loadAllShipsFailure,
  loadAllShipsSuccess
} from '../actions/ship.actions';
import {IShipResult, ShipsClient} from '../../services/api/pingapp-api.service';
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



}


