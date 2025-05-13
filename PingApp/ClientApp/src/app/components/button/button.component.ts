import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-buttons",
  imports: [],
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.scss",
})
export class ButtonComponent {
  // allShips$ = new BehaviorSubject<IShipModel[]>([]);

  @Output() actionSelection = new EventEmitter<"New" | "View All Ships">();

  constructor() {}

  // onClickGetShips(): void {
  //   console.log("button pressed get all ships");
  //
  //   this._shipApi.getAllShips().subscribe((ships) => {
  //     console.log("Ships Loaded", ships);
  //     this.allShips$.next(ships);
  //     this.getShipsSelect.emit(ships);
  //   });
  // }

  onActionSelect(action: "New" | "View All Ships"): void {
    this.actionSelection.emit(action);
    console.log(`button pressed - Emitting action: ${action}`);
  }

  // registerShip() {
  //   this.actionSelection.emit("New");
  //   console.log("button pressed register new ship");
  // }
  //
  // updateShip() {
  //   this.actionSelection.emit("Update");
  //   console.log("button pressed update ship");
  // }
  //
  // displayAllShips() {
  //   this.actionSelection.emit("View All Ships");
  //   console.log("button pressed display all ships");
  // }
}
