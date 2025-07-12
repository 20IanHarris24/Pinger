import {Component, EventEmitter, Output} from '@angular/core';
import {IShipModel} from '../../services/api/pingapp-api.service';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {
  selectAllShips,
  // selectAllDbShips,
  selectEditedShipId,
  selectNewlyAddedShipId
} from '../../state/reducers/ship.reducers';
import {combineLatest, distinctUntilChanged, map, Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {ActionService} from '../../services/action.service';
import {ReactiveFormsModule} from '@angular/forms';
import {SpinnerComponent} from '../spinner/spinner.component';



@Component({
  selector: 'app-showAllShips',
  imports: [NgForOf, NgIf, AsyncPipe, NgClass, ReactiveFormsModule, SpinnerComponent],
  templateUrl: 'show.all.ships.component.html',
  styleUrl: 'show.all.ships.component.scss',
})

export class ShowAllShipsComponent {

  hoverIndex: number = -1;
  loading$: Observable<boolean>;
  ships$: Observable<IShipModel[]>;
  newlyAddedShipId$: Observable<string | null>;
  newlyEditedShipId$: Observable<string | null>;
  viewModel$: Observable<any>;
  @Output() openModal = new EventEmitter<void>();


  constructor(protected actionService: ActionService, private store: Store) {

    // this.ships$ = this.store.select(selectAllDbShips);
    this.ships$ = this.store.select(selectAllShips).pipe(
      map(ships => ships.map(({ id, name, hostAddr }) => ({ id, name, hostAddr })))
    );

    this.loading$ = this.ships$.pipe(
      map(ships => ships.length === 0),
      distinctUntilChanged()
    );

    this.viewModel$ = combineLatest([this.loading$, this.ships$]).pipe(
      map(([loading, ships]) => ({ loading, ships }))
    );

    this.newlyAddedShipId$ = this.store.select(selectNewlyAddedShipId);
    this.newlyEditedShipId$ = this.store.select(selectEditedShipId);
  }


   onMouseOver(i: number)
    {
       this.hoverIndex = i;
       // console.log(this.hoverIndex);
       this.openModal.emit();

    }

    onMouseOff(){
        this.hoverIndex = -1;

    }


}
