import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import {
  UpdateUserRequest,
  UserResponse
} from "../../services/api/pingapp-api.service";

@Component({
  selector: "app-edit-user-modal",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: "./edit-user-modal.component.html",
  styleUrl: "./edit-user-modal.component.scss"
})
export class EditUserModalComponent implements OnInit {

  @Input({ required: true })
  user!: UserResponse;

  protected editUserForm: FormGroup;

  constructor(
    protected activeModal: NgbActiveModal,
    private readonly fb: FormBuilder
  ) {
    this.editUserForm = this.fb.group({
      userName: ["", Validators.required],
      email: ["", [
        Validators.required,
        Validators.email
      ]],
      role: ["", Validators.required]
    });
  }

  ngOnInit(): void {
    this.editUserForm.patchValue({
      userName: this.user.userName,
      email: this.user.email,
      role: this.user.role
    });
  }

  onSave(): void {

    if (this.editUserForm.invalid) {
      this.editUserForm.markAllAsTouched();
      return;
    }

    const request =
      new UpdateUserRequest(
        this.editUserForm.getRawValue()
      );

    this.activeModal.close(request);
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
