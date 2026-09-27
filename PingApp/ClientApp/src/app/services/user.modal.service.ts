import { Injectable } from "@angular/core";
import { UtilityService } from "./utility.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RegisterRequest } from './api/pingapp-api.service';
import { NewUserModalComponent } from '../components/new-user-modal/new-user-modal.component';
import {ManageUserModalComponent} from '../components/manage-user-modal/manage-user-modal.component';


  @Injectable({
    providedIn: 'root'
  })
  export class UserModalService {
    constructor(
      private readonly modalService: NgbModal,
      private readonly utility: UtilityService,
    ) {}


    openManage(): void {
      this.utility.blurActiveElement();
      this.modalService.open(ManageUserModalComponent,
        {
          size: 'lg'
        });
    }


    async openNew(): Promise<RegisterRequest | undefined> {
      this.utility.blurActiveElement();

      const ref = this.modalService.open(NewUserModalComponent);

      try {
        return await ref.result as RegisterRequest;
      } catch {
        return undefined;
      }
    }


}






