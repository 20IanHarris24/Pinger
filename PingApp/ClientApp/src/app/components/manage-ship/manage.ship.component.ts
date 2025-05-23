import { Component} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import {ButtonFunctionService} from '../../services/button.function.service';


@Component({
  selector: 'app-manageShip',
  imports: [ButtonComponent],
  templateUrl: './manage.ship.component.html',
  styleUrl: './manage.ship.component.scss',
})
export class ManageShipComponent {

   constructor(protected buttonServices: ButtonFunctionService) {}

  handleActionSelection(action: 'New') {
    // console.log(`Action selected: ${action}`);
    this.buttonServices.select(action);
  }
}
