import {AsyncPipe, NgClass, NgFor, NgIf} from '@angular/common';
import { Component} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IShipStatusDto} from '../../services/api/pingapp-api.service';
import {combineLatest, distinctUntilChanged, map, Observable} from 'rxjs';
import {selectAllShips} from '../../state/selectors/ship.selectors';
import { Store } from '@ngrx/store';
import {UtilityService} from '../../services/utility.service';
import {Spinner2Component} from '../spinner-2/spinner-2.component';


@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  imports: [AsyncPipe, NgFor, Spinner2Component, NgIf, NgClass],
})
export class HomeComponent {

  ships$: Observable<IShipStatusDto[]>;
  isLoading$: Observable<boolean>;
  viewModel$: Observable<any>;


  constructor(protected utility: UtilityService, private store: Store) {
    this.ships$ = this.store.select(selectAllShips);
    this.isLoading$ = this.ships$.pipe(
      map(ships => ships.length === 0),
      distinctUntilChanged()
    );

    this.viewModel$ = combineLatest([this.isLoading$, this.ships$]).pipe(
      map(([isLoading, ships]) => ({ isLoading, ships }))
    );

  }

}


