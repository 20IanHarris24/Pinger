import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, delay, map, mergeMap, of, switchMap, tap, withLatestFrom} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import * as ShipActions from '../actions/ship.actions'
import {IShipModel, IShipResult, ShipModel, ShipResult, ShipsClient} from '../../services/api/pingapp-api.service';
import {ButtonFunctionService} from '../../services/button.function.service';
import {selectByTest, selectDbShipById} from '../reducers/ship.reducers';
import {Store} from '@ngrx/store';



@Injectable()
export class ShipEffects {

  private actions$ = inject(Actions);
  private buttonService = inject(ButtonFunctionService);
  private client = inject(ShipsClient)
  private store = inject(Store);

  /* @Effect */
  deleteShip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.deleteShip),
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
          map(() => ShipActions.deleteShipSuccess({id})),
          catchError((error) => {
            console.error('[Effect] deleteShip error:', error);
            this.buttonService._deleteStatus$.next('error');
            this.buttonService._deleteErrorMessage$.next(
              error?.message || 'Unexpected error.'
            );
            return of(ShipActions.deleteShipFailure({error}));
          })
        )
      )
    )
  );

  /* @Effect */
  // deleteShipSuccess$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ShipActions.deleteShipSuccess),
  //     tap(() => {
  //       console.log('[Effect] deleteShipSuccess$ fired')
  //
  //     }),
  //     map(() => loadAllShips())
  //  )
  // );

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
          catchError((error) => of(ShipActions.loadAllShipsFailure({ error })))
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
    { dispatch: false }
  );



  loadShip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.loadShip),
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
            return ShipActions.loadShipSuccess({ship: enrichedShip});
          }),
          tap(() => {
            console.log('[Error] No enriched ship found')
          }),
           catchError((error) => of(ShipActions.loadShipFailure({ error })))
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
    { dispatch: false }
  );


  registerShip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.registerShip),
      tap(() => {
        console.log('[Effect] registerShip$ fired');
      }),
      switchMap(({ newShipDto }) =>
        this.client.registerShip(newShipDto).pipe(
          map((response) => ShipActions.registerShipSuccess({ newShip: response })),
          tap(() => {
            console.log('[Error] No ship registered')
          }),


          catchError((error) => of(ShipActions.registerShipFailure({ error })))
        )
      )
    )
  );

  registerShipSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.registerShipSuccess),
      mergeMap(({newShip}) => [
        ShipActions.loadAllShips(),
        ShipActions.setAddedShipId({idTrack: newShip.id}),
    ])
   )
  );


  clearAddedShipId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.setAddedShipId),
      delay(3000),
      map(() => ShipActions.setAddedShipId({ idTrack: null }))
    )
  );




  updateShip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.updateShip),
      tap(() => {
        console.log('[Effect] updateShip$ fired');
      }),
      switchMap(({ id, updateDto }) =>
        this.client.updateShipModel(id, updateDto).pipe(
          // Combine API response with existing ship from store
          withLatestFrom(this.store.select(selectByTest(id))),
          map(([response, existingShip]) => {
            const shipResultInstance =  ShipResult.fromJS(response)
            shipResultInstance.result = existingShip?.result ?? 'Unknown';
            return ShipActions.updateShipSuccess({ editShip: shipResultInstance});
          }),
          // tap(() => {
          //   console.log('[Effect] updateShipSuccess dispatched');
          // }),
          catchError((error) => {
            console.log('[Error] Ship update failed');
            return of(ShipActions.updateShipFailure({ error }));
          })
        )
      )
    )
  );






  // updateShip$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ShipActions.updateShip),
  //     tap(() => {
  //       console.log('[Effect] updateShip$ fired');
  //     }),
  //     switchMap(({ id, updateDto }) =>
  //       this.client.updateShipModel(id, updateDto).pipe(
  //         map((response: IShipModel) => ShipActions.updateShipSuccess({ editShip: response })),
  //         tap(() => {
  //           console.log('[Effect] updateShipSuccess dispatched');
  //         }),
  //         catchError((error) => {
  //           console.log('[Error] Ship update failed');
  //           return of(ShipActions.updateShipFailure({ error }));
  //         })
  //       )
  //     )
  //   )
  // );



  updateShipSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.updateShipSuccess),
      tap(() => {
        console.log('[Effect] updateShipSuccess$ fired');
      }),
      mergeMap(({ editShip }) => [
        ShipActions.loadAllShips(),
        ShipActions.setEditedShipId({ idEdit: editShip.id }),
      ])
    )
  );



  clearEditedShipId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipActions.setEditedShipId),
      delay(3000),
      map(() => ShipActions.setEditedShipId({ idEdit: null }))
    )
  );

}
