
import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { RegisterRequest } from "../../services/api/pingapp-api.service";



@Component({
  selector: "app-new-user-modal",
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: "./new-user-modal.component.html",
  styleUrl: "./new-user-modal.component.scss",
})
export class NewUserModalComponent {

  protected newForm: FormGroup;

  constructor(
    protected activeModal: NgbActiveModal,
  ) {
    this.newForm = new FormGroup({
      userName: new FormControl<string>("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl<string>("", {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email,
        ],
      }),
      password: new FormControl<string>("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      role: new FormControl<string>("Viewer", {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  onAddUser(): void {
    if (!this.newForm.valid) {
      return;
    }

    const request = new RegisterRequest(
      this.newForm.getRawValue(),
    );

    this.activeModal.close(request);

    this.newForm.reset({
      userName: "",
      email: "",
      password: "",
      role: "Viewer",
    });
  }

  onClearInput(): void {
    this.newForm.reset({
      userName: "",
      email: "",
      password: "",
      role: "Viewer",
    });
  }
}
