import { Component} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import {ActionService} from '../../services/action.service';


@Component({
  selector: 'app-manageShip',
  imports: [ButtonComponent],
  templateUrl: './manage.ship.component.html',
  styleUrl: './manage.ship.component.scss',
})
export class ManageShipComponent {

   constructor(protected actionService: ActionService) {}


  handleActionSelection(action: 'New') {
    // console.log(`Action selected: ${action}`);
    this.actionService.select(action);
  }

}
