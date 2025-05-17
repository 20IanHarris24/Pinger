import {Component, EventEmitter, Output} from '@angular/core';
import {IShipModel} from '../../services/api/pingapp-api.service';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {selectAllDbShips} from '../../state/reducers/ship.reducers';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {ButtonFunctionService} from '../../services/button.function.service';



@Component({
  selector: 'app-showAllShips',
  imports: [NgForOf, NgIf, AsyncPipe],
  templateUrl: 'show.all.ships.component.html',
  styleUrl: 'show.all.ships.component.scss',
})

export class ShowAllShipsComponent {
  hoverIndex: number = -1;
  ships$: Observable<IShipModel[]>;
  @Output() openModal = new EventEmitter<void>();


  constructor(protected buttonService: ButtonFunctionService, private store: Store) {

    this.ships$ = this.store.select(selectAllDbShips);

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
