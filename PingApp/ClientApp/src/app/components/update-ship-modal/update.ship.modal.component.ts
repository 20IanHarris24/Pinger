import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {IShipModel, ShipUpdateDto} from '../../services/api/pingapp-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Store} from '@ngrx/store';
import {updateShip} from '../../state/actions/ship.actions';
import {selectDbShipById} from '../../state/reducers/ship.reducers';
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
  originalShipData!: IShipModel;
  @Input() editShipId!: string;

  constructor(
    protected activeModal: NgbActiveModal, private store: Store,)
  {
    this.updateForm = new FormGroup({
      name: new FormControl<string>('', { nonNullable: true }),
      hostAddr: new FormControl<string>('', { nonNullable: true }),
    });

  }


  ngOnInit(): void{
    console.log('[Modal] Calling preload with editShipId:', this.editShipId);
    this.store.select(selectDbShipById(this.editShipId)).pipe(take(1)).subscribe((ship)=>{
      if (ship) {
        this.originalShipData = { ...ship };
        this.updateForm.patchValue({
          name: ship.name,
          hostAddr: ship.hostAddr,
        });
      }
    });
  }


  onSubmit(): void {
    console.log('button pressed update ship');

    if (this.updateForm.valid) {
      const updateDto: ShipUpdateDto = this.updateForm.getRawValue();
      console.log('Information submitted: ', updateDto);
      this.store.dispatch(updateShip({id: this.editShipId, updateDto}));
      this.updateForm.reset();
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
