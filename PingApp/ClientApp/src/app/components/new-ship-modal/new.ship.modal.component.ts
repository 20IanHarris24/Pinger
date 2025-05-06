import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShipModel, ShipsClient } from '../../services/api/pingapp-api.service';

@Component({
  selector: 'app-modal-manage-ship',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './new.ship.modal.component.html',
  styleUrl: './new.ship.modal.component.scss',
})
export class NewShipModalComponent {
  private _shipRegSet = new ShipModel();
  protected regForm: FormGroup;

  constructor(
    protected activeModal: NgbActiveModal,
    private _shipApi: ShipsClient
  ) {
    this.regForm = new FormGroup({
      name: new FormControl<string>('', { nonNullable: true }),
      hostAddr: new FormControl<string>('', { nonNullable: true }),
    });
  }

  onSubmitAddShip(): void {
    console.log('button pressed add ship');

    if (this.regForm.valid) {
      this._shipRegSet = ShipModel.fromJS(this.regForm.value);
      console.log(this.regForm.value);
      this._shipApi.registerShip(this._shipRegSet).subscribe();
    }
  }
}
