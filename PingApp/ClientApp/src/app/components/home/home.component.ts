import {AsyncPipe, NgClass, NgFor, NgIf} from '@angular/common';
import { Component} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IShipResult } from '../../services/api/pingapp-api.service';
import {combineLatest, distinctUntilChanged, map, Observable} from 'rxjs';
import {selectAllShips} from '../../state/reducers/ship.reducers';
import { Store } from '@ngrx/store';
import {UtilityMethodsService} from '../../services/utility.methods.service';
import {SpinnerComponent} from '../spinner/spinner.component';


@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  imports: [AsyncPipe, NgFor, NgClass, SpinnerComponent, NgIf],
})
export class HomeComponent {

  ships$: Observable<IShipResult[]>;
  loading$: Observable<boolean>;
  viewModel$: Observable<any>;


  constructor(protected utility: UtilityMethodsService, private store: Store) {
    this.ships$ = this.store.select(selectAllShips);
    this.loading$ = this.ships$.pipe(
      map(ships => ships.length === 0),
      distinctUntilChanged()
    );

    this.viewModel$ = combineLatest([this.loading$, this.ships$]).pipe(
      map(([loading, ships]) => ({ loading, ships }))
    );

    // this.viewModel$.subscribe(vm => {
    //   console.log('Loading:', vm.loading);
    //   console.log('Ships count:', vm.ships.length);
    // });



  }

}


