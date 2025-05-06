import { Component, EventEmitter, inject, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IShipModel,
  ShipModel,
  ShipsClient,
} from '../../services/api/pingapp-api.service';
import { BehaviorSubject } from 'rxjs';
// import { AsyncPipe, NgForOf } from "@angular/common";
import { ManageShipComponent } from '../manage-ship/manage.ship.component';
import { ShowAllShipsComponent } from '../show-all-ships/show.all.ships.component';

@UntilDestroy()
@Component({
  selector: 'app-admin',
  templateUrl: 'admin.component.html',
  // styleUrl: "admin.component.scss",
  imports: [ReactiveFormsModule, ManageShipComponent, ShowAllShipsComponent],
})
export class AdminComponent {
  private readonly _shipApi = inject(ShipsClient);
  // private _shipRegSet = new ShipModel();

  // shipForm = new FormGroup({
  //   name: new FormControl<string>("", { nonNullable: true }),
  //   hostAddr: new FormControl<string>("", { nonNullable: true }),
  // });

  // @Output() getShipsSelect = new EventEmitter<IShipModel[]>();
  // @Output() actionSelection = new EventEmitter<"New" | "Update">();
  allShips$ = new BehaviorSubject<IShipModel[]>([]);

  constructor() {}

  onClickGetShips(): void {
    console.log('button pressed get all ships');

    this._shipApi.getAllShips().subscribe((ships) => {
      console.log('Ships Loaded', ships);
      this.allShips$.next(ships);
      // this.getShipsSelect.emit(ships);
    });
  }

  // onSubmitAddShip(): void {
  //   console.log("button pressed add ship");
  //
  //   if (this.shipForm.valid) {
  //     this._shipRegSet = ShipModel.fromJS(this.shipForm.value);
  //     console.log(this.shipForm.value);
  //     this._shipApi.registerShip(this._shipRegSet).subscribe();
  //   }
  // }

  // registerShip() {
  //   this.actionSelection.emit("New");
  //   console.log("button pressed register new ship");
  // }

  // updateShip() {
  //   this.actionSelection.emit("Update");
  //   console.log("button pressed update ship");
  // }
}
