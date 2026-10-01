import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserActionService } from '../../services/user.action.service';
import {
  UserResponse,
  UsersClient
} from "../../services/api/pingapp-api.service";

@Component({
  selector: 'app-manage-user-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-user-modal.component.html',
  styleUrl: './manage-user-modal.component.scss'
})
export class ManageUserModalComponent {

  protected users: UserResponse[] = [];

  constructor(
    protected activeModal: NgbActiveModal,
    private userAction: UserActionService,
    private readonly usersClient: UsersClient,
  ) {
    this.loadUsers();
  }

  addNewUser(): void {
    void this.userAction.select("New");

  }

  private loadUsers(): void {
    this.usersClient.getUsers()
      .subscribe({
        next: users => {
          this.users = users;
        },
        error: error => {
          console.error("Failed to load users:", error);
        }
      });
  }










}
