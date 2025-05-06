import { Component, Input } from '@angular/core';
import { IShipModel } from '../../services/api/pingapp-api.service';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-showAllShips',
  imports: [AsyncPipe, NgForOf],
  templateUrl: 'show.all.ships.component.html',
  styleUrl: 'show.all.ships.component.scss',
})
export class ShowAllShipsComponent {
  @Input() allShips: BehaviorSubject<IShipModel[]> = new BehaviorSubject<
    IShipModel[]
  >([]);
}
