import {Injectable} from '@angular/core';
import {NewShipModalComponent} from '../components/new-ship-modal/new.ship.modal.component';
import {UpdateShipModalComponent} from '../components/update-ship-modal/update.ship.modal.component';
import {DeleteShipModalComponent} from '../components/delete-ship-modal/delete.ship.modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Injectable({providedIn: 'root'})
export class ModalActionService {

  constructor(private modalService: NgbModal) {}

  // openModalNew() {
  //   //console.log('Opening modal for new ship registration');
  //   this.modalService.open(NewShipModalComponent);
  // }


  openModalUpdate(id:string) {
    console.log('Opening modal to update a ship');
    console.log('object in updateModal', id);
    const modalRef = this.modalService.open(UpdateShipModalComponent);
    modalRef.componentInstance.editShipId = id;

  }

  openModalDelete(id: string) {
    // this._deleteStatus$.next('idle');
    console.log('Opening modal to delete a ship');
    const modalRef = this.modalService.open(DeleteShipModalComponent);
    modalRef.componentInstance.chosenShipToDelete = id;

  }

}
