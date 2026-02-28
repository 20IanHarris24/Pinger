import { Component, Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-newShipModal',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './new.ship.modal.component.html',
  styleUrl: './new.ship.modal.component.scss',
})
export class NewShipModalComponent {

  protected newForm!: FormGroup;
  @Input() result!: string;

  constructor(
    protected activeModal: NgbActiveModal) {
    this.newForm = new FormGroup({
      name: new FormControl<string>('', {nonNullable: true}),
      hostAddr: new FormControl<string>('', {nonNullable: true}),
    });
  }


  onAddShip(): void {

    if (!this.newForm.valid)  return;

      const createShipDto = this.newForm.getRawValue();
      this.activeModal.close(createShipDto);
      this.newForm.reset({
        name: '',
        hostAddr: ''
      });

    }


    onClearInput(): void {
      this.newForm.reset();
    }

  }
