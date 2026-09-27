import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: "app-buttons",
  imports: [],
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.scss",
})
export class ButtonComponent {

  @Input() label = "Add";
  @Output() clicked = new EventEmitter<void>();

  constructor() {}

  onClick(): void {
    this.clicked.emit();

  }

}
