import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-addAnotherShipModal',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './addAnother.ship.modal.component.html',
  styleUrl: './addAnother.ship.modal.component.scss',
})
export class AddAnotherShipModalComponent {




  constructor(protected activeModal: NgbActiveModal){}









}
