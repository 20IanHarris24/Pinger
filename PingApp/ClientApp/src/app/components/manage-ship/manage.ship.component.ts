import { Component, EventEmitter, Output } from '@angular/core';
import {  IShipModel,   ShipsClient,} from '../../services/api/pingapp-api.service';
import { ButtonComponent } from '../button/button.component';
import { NewShipModalComponent } from '../new-ship-modal/new.ship.modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateShipModalComponent } from '../update-ship-modal/update.ship.modal.component';
import { BehaviorSubject } from 'rxjs';
import {ButtonFunctionService} from '../../services/button.function.service';

@Component({
  selector: 'app-manageShip',
  imports: [ButtonComponent],
  templateUrl: './manage.ship.component.html',
  styleUrl: './manage.ship.component.scss',
})
export class ManageShipComponent {

  /*allShips$ = new BehaviorSubject<IShipModel[]>([]);
  @Output() getShipsSelect = new EventEmitter<IShipModel[]>();
  @Output() getAllShips = new EventEmitter<void>();*/

  constructor(protected buttonFunctions: ButtonFunctionService
    // protected client: ShipsClient,
    // protected modalService: NgbModal
  ) {}

  handleActionSelection(action: 'New' | 'View All Ships') {
    console.log(`Action selected: ${action}`);
    this.buttonFunctions.select(action);

    /*switch (action) {
      case 'New':
        this.openModalNew();
        break;
     /!* case 'Update':
        this.openModalUpdate();
        break;*!/
      case 'View All Ships':
        // this.getAllShips.emit();
        this.onClickGetShips();
        console.log('case: view all ships');
        break;
    }*/
  }

  /*openModalNew() {
    console.log('Opening modal for new ship registration');
    this.modalService.open(NewShipModalComponent);
  }*/


  /*onClickGetShips() {
    console.log("button pressed get all ships");
    this.client.getAllShips().subscribe((ships) => {
      console.log("Ships Loaded", ships);
      this.allShips$.next(ships);
      this.getShipsSelect.emit(ships);
    });
  }*/
}
