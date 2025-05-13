import { EventEmitter, Injectable, Output } from '@angular/core';
import {IShipModel, ShipsClient} from './api/pingapp-api.service';
import { BehaviorSubject} from 'rxjs';
import {NewShipModalComponent} from '../components/new-ship-modal/new.ship.modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UpdateShipModalComponent} from '../components/update-ship-modal/update.ship.modal.component';

@Injectable({ providedIn: 'root' })
export class ButtonFunctionService {
   _allShips$: BehaviorSubject<IShipModel[]>;

  constructor(protected client: ShipsClient, protected modalService: NgbModal) {

    this._allShips$ = new BehaviorSubject<IShipModel[]>([]);

  }


  select(action: 'New' | 'View All Ships') {
    //console.log(`Action requested: ${action}`);

    switch (action) {
      case 'New':
        this.openModalNew();
        console.log('case: new');
        break;
      /* case 'Update':
         this.openModalUpdate();
         break;*/
      case 'View All Ships':
        this.callAllShips();
        console.log('case: view all ships');
        break;
    }
  }


  callAllShips() {
    //console.log("button pressed get all ships");
    this.client.getAllShips().subscribe((ships) => {
      //console.log("Ships Loaded", ships);
      this._allShips$.next(ships);
      });
  }


  openModalNew() {
    //console.log('Opening modal for new ship registration');
    this.modalService.open(NewShipModalComponent);
  }


  openModalUpdate() {
    console.log('Opening modal to update a ship');
    this.modalService.open(UpdateShipModalComponent);
  }


}
