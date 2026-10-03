import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserActionService } from '../../services/user.action.service';
import {
  UserResponse,
  UsersClient
} from "../../services/api/pingapp-api.service";
import {ButtonComponent} from '../button/button.component';

@Component({
  selector: 'app-manage-user-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
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

  async addNewUser(): Promise<void> {
    const userCreated = await this.userAction.select("New");
    if (userCreated){
      this.loadUsers();
    }
  }


  async editUser(user:UserResponse): Promise<void> {
    const userUpdated = await this.userAction.select( "Edit", user);

    if (userUpdated) {
      this.loadUsers();
    }
  }

  async deleteUser(user: UserResponse): Promise<void> {

    if (!user.userName) {
      return;
    }

    const userDeleted = await this.userAction.select("Delete", user);

    if (userDeleted) {
      this.loadUsers();
    }

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
