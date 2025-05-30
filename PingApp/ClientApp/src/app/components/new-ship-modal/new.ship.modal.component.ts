import {Component, Input} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {Store} from '@ngrx/store';
import {registerShip} from '../../state/actions/ship.actions';
import {AddAnotherShipModalComponent} from '../addanother-ship-modal/addanother.ship.modal.component';

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
    protected activeModal: NgbActiveModal, protected modalService: NgbModal, protected store: Store) {
    this.newForm = new FormGroup({
      name: new FormControl<string>('', {nonNullable: true}),
      hostAddr: new FormControl<string>('', {nonNullable: true}),
    });
  }


  onAddShip(): void {

    if (!this.newForm.valid) {
       return;
    }

    const newShip = {...this.newForm.value};

      // console.log('dispatching a new ship', newShip);
      this.store.dispatch(registerShip({newShipDto: newShip}));
      this.newForm.reset();

      const modalRef = this.modalService.open(AddAnotherShipModalComponent);

      modalRef.result.then((result) => {
        // console.log(result);
          if (result.toLowerCase() === 'yes') {
            // console.log('User wants to add another ship — keeping modal open');
            this.newForm.reset();
            this.newForm.markAsPristine();
            this.newForm.markAsUntouched();
            this.newForm.updateValueAndValidity();
          } else {
            // console.log('User said no — closing Add Ship modal');
            this.activeModal.close();
          }
        },

        () => {
          this.activeModal.close();
        }
      );
    }


    onAddCancel(): void {
      console.log('button pressed cancel input ship');
      this.newForm.reset();
    }

  }
