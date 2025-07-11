import {Component, Input} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ButtonFunctionService, DeleteStatus} from '../../services/button.function.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {deleteShip} from '../../state/actions/ship.actions';


@Component({
  selector: 'app-deleteShipModal',
  imports: [
    ReactiveFormsModule,
    NgSwitch,
    NgSwitchCase,
    NgIf
  ],
  templateUrl: './delete.ship.modal.component.html',
  styleUrl: './delete.ship.modal.component.scss'
})
export class DeleteShipModalComponent {

  private _sub: Subscription;
  deleteStatus: DeleteStatus = 'idle';
  errorMessage: string = '';
  isConfirmed: boolean = false;


  @Input() chosenShipToDelete!: string;



  constructor(protected buttonServices: ButtonFunctionService, protected activeModal: NgbActiveModal, private store: Store) {
    this._sub = this.buttonServices._deleteStatus$.subscribe((status) => {
      this.deleteStatus = status;

      if (status === 'success') {
        setTimeout(() => {
          this.activeModal.dismiss('deleted');
          this._sub.unsubscribe();
        }, 1000);
      }

    });




    this.buttonServices._deleteErrorMessage$.subscribe((deleteError) => {
      this.errorMessage = deleteError;
    });

  }

  confirm(): void {
    this.isConfirmed = true;
    //console.log('id to be deleted: ', this.chosenShipToDelete)
    this.store.dispatch(deleteShip({ id: this.chosenShipToDelete }));

  }




}
