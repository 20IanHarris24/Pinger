import {Component, Input} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-deleteShipModal',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './delete.ship.modal.component.html',
  styleUrl: './delete.ship.modal.component.scss'
})
export class DeleteShipModalComponent {

  isConfirmed: boolean = false;




  @Input() chosenShipToDelete!: string;



  constructor(protected activeModal: NgbActiveModal) {

  }

  confirmDelete(): void {
    this.isConfirmed = true;
    console.log('id to be deleted: ', this.chosenShipToDelete)
    this.activeModal.close(this.isConfirmed);
  }

  cancelDelete(): void {
    this.activeModal.dismiss();
  }


}
