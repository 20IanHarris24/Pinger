import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {IShipDto, ShipUpdateDto} from '../../services/api/pingapp-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Store} from '@ngrx/store';
import {selectDbShipById} from '../../state/selectors/ship.selectors';
import {take} from 'rxjs';


@Component({
  selector: 'app-updatesShipModal',
  imports: [
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './update.ship.modal.component.html',
  styleUrl: './update.ship.modal.component.scss'
})
export class UpdateShipModalComponent {


  protected updateForm: FormGroup;
  originalShipData!: IShipDto;
  @Input() editShipId!: string;

  constructor(
    protected activeModal: NgbActiveModal, private store: Store)
  {
    this.updateForm = new FormGroup({
      name: new FormControl<string>('', { nonNullable: true }),
      hostAddr: new FormControl<string>('', { nonNullable: true }),
    });

  }


  ngOnInit(): void{

    if(!this.editShipId){
      console.warn('[Modal] Missing editShipId');
      this.activeModal.dismiss();
      return;
    }

    console.log('[Modal] Calling preload with editShipId:', this.editShipId);
    this.store.select(selectDbShipById(this.editShipId))
      .pipe(take(1))
      .subscribe((ship)=> {
        if (!ship) {
          console.warn('[Modal] Ship not found in store for id:', this.editShipId);
          this.activeModal.dismiss();
          return;
        }


        this.originalShipData = {...ship};
        this.updateForm.reset(
          {name: ship.name, hostAddr: ship.hostAddr},
          {emitEvent: false}
        );
        this.updateForm.markAsPristine();
        this.updateForm.markAsUntouched();
      });
  }


  onSubmit(): void {
    console.log('button pressed update ship');

    if (this.updateForm.valid) {
      const updateDto: ShipUpdateDto = this.updateForm.getRawValue();
      console.log('Information submitted: ', updateDto);
      this.activeModal.close(updateDto);
    }
  }

  onCancel(): void {
    this.updateForm.patchValue({
      name: this.originalShipData.name,
      hostAddr: this.originalShipData.hostAddr
    });
    this.updateForm.markAsPristine();
    this.updateForm.markAsUntouched();
  }

}
