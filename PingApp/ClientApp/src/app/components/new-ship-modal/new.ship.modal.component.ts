import { Component, Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { registerShip } from '../../state/actions/ship.actions';


@Component({
  selector: 'app-newShipModal',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './new.ship.modal.component.html',
  styleUrl: './new.ship.modal.component.scss',
})
export class NewShipModalComponent {

  protected newForm!: FormGroup;
  @Input() result!: string;

  constructor(
    protected activeModal: NgbActiveModal, protected store: Store) {
    this.newForm = new FormGroup({
      name: new FormControl<string>('', {nonNullable: true}),
      hostAddr: new FormControl<string>('', {nonNullable: true}),
    });
  }


  onAddShip(): void {

    if (!this.newForm.valid)  return;


    const newShip = {...this.newForm.value};

      this.store.dispatch(registerShip({newShipDto: newShip}));
      this.newForm.reset();

      this.activeModal.close('ship-added');
    }


    onAddCancel(): void {
      console.log('button pressed cancel input ship');
      this.newForm.reset();
    }

  }
