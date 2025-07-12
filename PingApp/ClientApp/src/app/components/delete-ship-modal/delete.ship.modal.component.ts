import {Component, Input} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {deleteShip} from '../../state/actions/ship.actions';
import {ShipDeleteService} from '../../services/ship.delete.service';


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
  deleteStatus: string = 'idle';
  errorMessage: string = '';
  isConfirmed: boolean = false;


  @Input() chosenShipToDelete!: string;



  constructor(public deleteState: ShipDeleteService, protected activeModal: NgbActiveModal, private store: Store) {
    this._sub = this.deleteState.deleteStatus$.subscribe((status) => {
      this.deleteStatus = status;

      if (status === 'success') {
        setTimeout(() => {
          this.activeModal.dismiss('deleted');
          this._sub.unsubscribe();
        }, 1000);
      }

    });




    this.deleteState.deleteErrorMessage$.subscribe((deleteError) => {
      this.errorMessage = deleteError;
    });

  }

  confirm(): void {
    this.isConfirmed = true;
    this.store.dispatch(deleteShip({ id: this.chosenShipToDelete }));
  }




}
