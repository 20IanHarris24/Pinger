import { Injectable} from '@angular/core';
import {IShipModel, IShipResult} from './api/pingapp-api.service';
import { BehaviorSubject} from 'rxjs';
import {NewShipModalComponent} from '../components/new-ship-modal/new.ship.modal.component';
import {UpdateShipModalComponent} from '../components/update-ship-modal/update.ship.modal.component';
import {DeleteShipModalComponent} from '../components/delete-ship-modal/delete.ship.modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';





export type DeleteStatus = 'idle' | 'deleting' | 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class ButtonFunctionService {

   _deleteErrorMessage$: BehaviorSubject<string>;
   _deleteStatus$: BehaviorSubject<DeleteStatus>;
   _allShips$: BehaviorSubject<IShipModel[]>;



  constructor(protected modalService: NgbModal) {

    this._allShips$ = new BehaviorSubject<IShipModel[]>([]);
    this._deleteErrorMessage$ = new BehaviorSubject<string>('');
    this._deleteStatus$ = new BehaviorSubject<DeleteStatus>('idle');

  }


  select(action: 'New'): void;
  select(action: 'Edit' | 'Delete', shipInFocus: IShipResult): void;
  select(action: 'New' | 'Edit' | 'Delete', shipInFocus?: IShipResult): void {
    switch (action) {
      case 'New':
        this.openModalNew();
        break;
      case 'Edit':
        if (shipInFocus) {
          this.openModalUpdate(shipInFocus.id);
          console.log('ship to be updated', shipInFocus.id);
        }
        break;
      case 'Delete':
        if (shipInFocus) {
          this.openModalDelete(shipInFocus.id);
          console.log('ship to be deleted', shipInFocus.id);
        }
        break;
    }
  }




  openModalNew() {
    //console.log('Opening modal for new ship registration');
    this.modalService.open(NewShipModalComponent);
  }


  openModalUpdate(id:string) {
    console.log('Opening modal to update a ship');
    console.log('object in updateModal', id);
    const modalRef = this.modalService.open(UpdateShipModalComponent);
    modalRef.componentInstance.editShipId = id;

  }


  openModalDelete(id: string) {
    this._deleteStatus$.next('idle');
    console.log('Opening modal to delete a ship');
    const modalRef = this.modalService.open(DeleteShipModalComponent);
    modalRef.componentInstance.chosenShipToDelete = id;


  }




}
