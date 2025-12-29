import { Component } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { map, Observable, shareReplay } from 'rxjs';
import { ShipDto } from '../../services/api/pingapp-api.service';
import {Store} from '@ngrx/store';
import {
  PaginationModel,
  selectPaginationModel
} from '../../state/selectors/ship.selectors';
import {loadPaginatedShips} from '../../state/actions/ship.actions';
import {UtilityService} from '../../services/utility.service';


@Component({
  selector: 'app-pagination',
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: 'pagination.component.html',
  styleUrl: 'pagination.component.scss',
})

export class PaginationComponent {


  currentPage = 1;
  paginationArray$: Observable<Array<number>>;
  ships: ShipDto[] = [];
  paginationModel$: Observable<PaginationModel>;



  constructor(private store: Store, protected utility: UtilityService) {
    this.paginationModel$ = this.store.select(selectPaginationModel);
    this.paginationArray$ = this.paginationModel$.pipe(
      map(pm => Array.from({length: pm.totalPages}, (_: number, i: number) => i + 1)),
      shareReplay({refCount: true, bufferSize: 1})
    );  // avoid recompute
  }


  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.store.dispatch(loadPaginatedShips({
      page: newPage,
    }));
  }


}
