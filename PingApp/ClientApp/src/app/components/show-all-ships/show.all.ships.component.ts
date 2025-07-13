import { Component, EventEmitter, Output } from '@angular/core';
import { ShipDto } from '../../services/api/pingapp-api.service';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import {
  selectEditedShipId,
  selectNewlyAddedShipId, selectPaginatedShipViewModel
} from '../../state/reducers/ship.reducers';
import {Observable, tap} from 'rxjs';
import { Store } from '@ngrx/store';
import { ActionService } from '../../services/action.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../spinner/spinner.component';
import { loadPaginatedShips } from '../../state/actions/ship.actions';
import { TooltipComponent } from '../tooltip/tooltip.component';



@Component({
  selector: 'app-showAllShips',
  imports: [NgForOf, NgIf, AsyncPipe, NgClass, ReactiveFormsModule, SpinnerComponent, TooltipComponent],
  templateUrl: 'show.all.ships.component.html',
  styleUrl: 'show.all.ships.component.scss',
})

export class ShowAllShipsComponent {


  currentPage = 1;
  hoverIndex: number = -1;
  newlyAddedShipId$: Observable<string | null>;
  newlyEditedShipId$: Observable<string | null>;
  pageSize = 21;
  ships: ShipDto[] = [];
  sortBy = 'name';
  sortDirection = 'asc';
  viewModel$: Observable<{
    ships: ShipDto[];
    page: number;
    totalPages: number;
    totalItems: number;
    loading: boolean;
  }>;
  @Output() openModal = new EventEmitter<void>();


  constructor(protected actionService: ActionService, private store: Store) {


    this.viewModel$ = this.store.select(selectPaginatedShipViewModel).pipe(
      tap(vm => console.log('📦 ViewModel update:', vm))
    );
    this.newlyAddedShipId$ = this.store.select(selectNewlyAddedShipId);
    this.newlyEditedShipId$ = this.store.select(selectEditedShipId);

  }

  ngOnInit(): void {
    this.store.dispatch(loadPaginatedShips({ page: this.currentPage, size: this.pageSize }));
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

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.store.dispatch(loadPaginatedShips({ page: newPage, size: this.pageSize, sort: this.sortBy,
      direction: this.sortDirection }));
  }

}
