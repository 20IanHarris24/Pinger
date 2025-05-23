import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {ShipNewDto} from '../../services/api/pingapp-api.service';
import {Store} from '@ngrx/store';
import {registerShip} from '../../state/actions/ship.actions';

@Component({
  selector: 'app-newShipModal',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './new.ship.modal.component.html',
  styleUrl: './new.ship.modal.component.scss',
})
export class NewShipModalComponent {

  private _newShip = new ShipNewDto();
  protected newForm!: FormGroup;

  constructor(
    protected activeModal: NgbActiveModal, protected store: Store)
  {
    this.newForm = new FormGroup({
      name: new FormControl<string>('', { nonNullable: true }),
      hostAddr: new FormControl<string>('', { nonNullable: true }),
    });
  }

  onAddShip(): void {
    console.log('button pressed add ship');

    if (this.newForm.valid) {

      this._newShip.name = this.newForm.controls['name'].value;
      this._newShip.hostAddr = this.newForm.controls['hostAddr'].value;
      console.log(this._newShip);
      this.store.dispatch(registerShip({newShipDto: this._newShip}));
      this.newForm.reset();
    }
  }
}
