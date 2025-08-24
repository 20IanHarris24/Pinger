import {AsyncPipe, NgClass, NgFor, NgIf} from '@angular/common';
import { Component} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IShipResult } from '../../services/api/pingapp-api.service';
import {combineLatest, distinctUntilChanged, map, Observable} from 'rxjs';
import {selectAllShips} from '../../state/selectors/ship.selectors';
import { Store } from '@ngrx/store';
import {UtilityService} from '../../services/utility.service';
import {SpinnerComponent} from '../spinner/spinner.component';



@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  imports: [AsyncPipe, NgFor, SpinnerComponent, NgIf, NgClass],
})
export class HomeComponent {

  ships$: Observable<IShipResult[]>;
  loading$: Observable<boolean>;
  viewModel$: Observable<any>;


  constructor(protected utility: UtilityService, private store: Store) {
    this.ships$ = this.store.select(selectAllShips);
    this.loading$ = this.ships$.pipe(
      map(ships => ships.length === 0),
      distinctUntilChanged()
    );

    this.viewModel$ = combineLatest([this.loading$, this.ships$]).pipe(
      map(([loading, ships]) => ({ loading, ships }))
    );

  }

}


