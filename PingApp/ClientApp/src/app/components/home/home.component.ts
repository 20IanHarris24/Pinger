import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IShipResult } from '../../services/api/pingapp-api.service';
import { Observable } from 'rxjs';
import { selectAllShips } from '../../state/reducers/ship.reducers';
import { Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrl: 'home.component.scss',
  imports: [AsyncPipe, NgFor],
})
export class HomeComponent {
  private readonly _shipStore = inject(Store);

  ships$: Observable<IShipResult[]>;

  constructor() {
    this.ships$ = this._shipStore.select(selectAllShips);
  }

  getShipId(index: number, ship: IShipResult): string {
    return ship.id;
  }
}
