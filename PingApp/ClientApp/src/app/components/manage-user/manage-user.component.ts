import { Component } from "@angular/core";
import { ButtonComponent } from "../button/button.component";
// import { UserActionService } from "../../services/user.action.service";
import {UserModalService} from '../../services/user.modal.service';

@Component({
  selector: "app-manage-user",
  imports: [ButtonComponent],
  templateUrl: "./manage-user.component.html",
  styleUrl: "./manage-user.component.scss",
})
export class ManageUserComponent {

  constructor(protected userModalService: UserModalService) {}

  openManageUsers(): void {
    this.userModalService.openManage();
    // console.log('Manage users clicked');
  }




}
