import { EventEmitter, inject, Injectable, Output } from '@angular/core';
import { IShipResult } from './api/pingapp-api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ButtonFunctionService {
  private _testThing: BehaviorSubject<IShipResult[]>;
  _testThing$: Observable<IShipResult[]>;

  constructor() {
    this._testThing = new BehaviorSubject<IShipResult[]>([]);
    this._testThing$ = this._testThing.asObservable();
  }

  // registerShip() {
  //   this._testThing("Register");
  //   console.log("button pressed register ship");
  // }
  //
  // updateShip() {
  //   this.actionSelection.emit("Update");
  //   console.log("button pressed update ship");
  // }
  //
  //
  //
  // actionSelection(choice:'Register'" | 'Update'){
  //   choice === 'Register' ? this.registerShip() : this.updateShip();
  // }
}
