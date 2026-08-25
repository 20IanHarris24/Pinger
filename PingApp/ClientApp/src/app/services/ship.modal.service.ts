import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewShipModalComponent } from '../components/new-ship-modal/new.ship.modal.component';
import { AddAnotherShipModalComponent } from '../components/addanother-ship-modal/addanother.ship.modal.component';
import { UtilityService } from './utility.service';
import {ShipCreateDto, ShipUpdateDto} from './api/pingapp-api.service';
import {UpdateShipModalComponent} from '../components/update-ship-modal/update.ship.modal.component';
import {DeleteShipModalComponent} from '../components/delete-ship-modal/delete.ship.modal.component';


@Injectable({ providedIn: 'root' })
export class ShipModalFlowService {
  constructor(private modalService: NgbModal, private element: UtilityService) {}

  async launchNew(): Promise<ShipCreateDto[]> {
    let keepGoing = true;
    const dtos: ShipCreateDto[] = [];


    while (keepGoing) {
      this.element.blurActiveElement();
      const createdShip = await this.openNewShipModal();
      if (!createdShip) break;
      dtos.push(createdShip);

      const addAnotherNewShip = await this.openAddAnotherModal();
      keepGoing = addAnotherNewShip === true;
    }
      return dtos;
  }

  private async openNewShipModal(): Promise<ShipCreateDto | undefined> {
    const ref = this.modalService.open(NewShipModalComponent);

    try {
      return await ref.result;
    } catch {
      return undefined;
    }
  }

  private async openAddAnotherModal(): Promise<boolean | undefined> {
    const ref = this.modalService.open(AddAnotherShipModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });

    try {
      return await ref.result;
    } catch {
      return undefined;
    }
  }


  async launchUpdate(editShipId: string): Promise<ShipUpdateDto | undefined> {
    this.element.blurActiveElement();
      const ref = this.modalService.open(UpdateShipModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });

    ref.componentInstance.editShipId = editShipId;

    try {
      return await ref.result as ShipUpdateDto;

    } catch {
      return undefined;
    }
  }



  async launchDelete(editShipId: string): Promise<boolean> {
    this.element.blurActiveElement();
    const ref = this.modalService.open(DeleteShipModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });

    ref.componentInstance.editShipId = editShipId;

    try {
      return (await ref.result) === true;

    } catch {
      return false;
    }
  }




}
