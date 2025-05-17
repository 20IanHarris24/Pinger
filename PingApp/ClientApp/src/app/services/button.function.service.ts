import { Injectable} from '@angular/core';
import {IShipModel} from './api/pingapp-api.service';
import { BehaviorSubject} from 'rxjs';
import {NewShipModalComponent} from '../components/new-ship-modal/new.ship.modal.component';
// import {UpdateShipModalComponent} from '../components/update-ship-modal/update.ship.modal.component';
import {DeleteShipModalComponent} from '../components/delete-ship-modal/delete.ship.modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';





export type DeleteStatus = 'idle' | 'loading' | 'success' | 'error';

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

  selectAction(action: 'New'|'View All Ships') {
    //console.log(`Action requested: ${action}`);

    switch (action) {
      case 'New':
        this.openModalNew();
      break;
      // case 'View All Ships':
      //   this.callAllShips();
      // break;
    }
  }


  select(action: 'Edit'|'Delete', shipInFocus: IShipModel) {
    //console.log(`Action requested: ${action}`);

    switch (action) {
      case 'Edit':
         this.openModalUpdate();
         console.log('Action:', action);
         break;
      case 'Delete':
         this.openModalDelete(shipInFocus.id);
         console.log('Action:', action);
         console.log('ship to be deleted', shipInFocus.id);
         break;
    }
  }


  // callAllShips() {
  //   //console.log("button pressed get all ships");
  //   return this.client.getAllShips().subscribe((ships) => {
  //     this._allShips$.next(ships);
  //     //console.log("Ships Loaded", ships);
  //     });
  // }


  // confirmDeleteShip(id: string) {
  //  console.log('ship dB id:', id);
  //  this._deleteStatus$.next('loading');
  //
  //  this.client.deleteShip(id).subscribe({
  //     next: (response: FileResponse | null) => {
  //       if (response?.status === 200 || response && response?.status === 204 || response === null) {
  //         this._deleteStatus$.next('success');
  //         console.log('Delete Success:',response?.status ?? 'null (204)');
  //       } else {
  //         this._deleteStatus$.next('error');
  //         console.log('Unexpected response code:',response?.status);
  //       }
  //
  //     },
  //     error: (err) => {
  //       this._deleteStatus$.next('error');
  //       this._deleteErrorMessage$.next(err.message('Unexpected error.'));
  //     }
  //
  //   });
  // }

  openModalNew() {
    //console.log('Opening modal for new ship registration');
    this.modalService.open(NewShipModalComponent);
  }


  openModalUpdate() {
    console.log('Opening modal to update a ship');
    // const modalRef = this.modalService.open(UpdateShipModalComponent);

  }


  openModalDelete(id: string) {
    this._deleteStatus$.next('idle');
    // console.log('Opening modal to delete a ship');
    const modalRef = this.modalService.open(DeleteShipModalComponent);
    modalRef.componentInstance.chosenShipToDelete = id;


  }

}
