import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: "app-buttons",
  imports: [],
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.scss",
})
export class ButtonComponent {

  @Input() label = "Add";
  @Input() iconClass = "ti ti-circle-plus";
  @Input() btnProperty ="btn btn-lg btn-ghost-info";
  @Output() clicked = new EventEmitter<void>();

  constructor() {}

  onClick(): void {
    this.clicked.emit();

  }

}
