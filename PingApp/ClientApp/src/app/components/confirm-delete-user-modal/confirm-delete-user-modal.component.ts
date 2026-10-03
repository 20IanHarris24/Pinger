import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-confirm-delete-user-modal",
  standalone: true,
  imports: [],
  templateUrl: "./confirm-delete-user-modal.component.html",
  styleUrl: "./confirm-delete-user-modal.component.scss"
})
export class ConfirmDeleteUserModalComponent {

  @Input() userName = "";

  constructor(
    protected activeModal: NgbActiveModal
  ) {}

  confirm(): void {
    this.activeModal.close(true);
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}
