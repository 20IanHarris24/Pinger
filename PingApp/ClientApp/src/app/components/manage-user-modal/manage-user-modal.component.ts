import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {UserActionService} from '../../services/user.action.service';

@Component({
  selector: 'app-manage-user-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-user-modal.component.html',
  styleUrl: './manage-user-modal.component.scss'
})
export class ManageUserModalComponent {

  constructor(
    protected activeModal: NgbActiveModal,
    private userAction: UserActionService
  ) {}

  addNewUser(): void {
    void this.userAction.select("New");

  }
}
