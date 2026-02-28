import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-buttons",
  imports: [],
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.scss",
})
export class ButtonComponent {
  @Output() addShipSelection = new EventEmitter<"New">();

  constructor() {}

  onActionSelect(action: "New" ): void {
    this.addShipSelection.emit(action);

  }

}
