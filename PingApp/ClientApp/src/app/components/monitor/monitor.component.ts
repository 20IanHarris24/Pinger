import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';
import { Component } from '@angular/core';
import { IShipStatusDto } from '../../services/api/pingapp-api.service';
import { selectAllShips } from '../../state/selectors/ship.selectors';
import { Spinner2Component } from '../spinner-2/spinner-2.component';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { UntilDestroy } from '@ngneat/until-destroy';
import { UtilityService } from '../../services/utility.service';


@UntilDestroy()
@Component({
  selector: 'app-monitor',
  templateUrl: 'monitor.component.html',
  styleUrls: ['monitor.component.scss'],
  imports: [AsyncPipe, NgFor, Spinner2Component, NgIf, NgClass],
})
export class MonitorComponent {

  ships$: Observable<IShipStatusDto[]>;
  isLoading$: Observable<boolean>;
  viewModel$: Observable<any>;


  constructor(protected utility: UtilityService, private store: Store, private _titleService: Title)
  {
    this._titleService.setTitle("Home · Pinger");
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


