import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-buttons",
  imports: [],
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.scss",
})
export class ButtonComponent {
  // allShips$ = new BehaviorSubject<IShipModel[]>([]);

  @Output() actionSelection = new EventEmitter<"New">();

  constructor() {}

  onActionSelect(action: "New" ): void {
    this.actionSelection.emit(action);
    // console.log(`button pressed - Emitting action: ${action}`);
  }

}
