import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IShipResult, ShipDto } from '../../services/api/pingapp-api.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tooltip',
  imports: [
    NgIf
  ],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})



export class TooltipComponent {


  @Input() ship!: ShipDto;
  @Input() isHovered: boolean = false;

  @Output() edit = new EventEmitter<IShipResult>();
  @Output() delete = new EventEmitter<IShipResult>();

  // Convert ShipDto to IShipResult before emitting
  get resultDto(): IShipResult {
    return {
      id: this.ship.id,
      name: this.ship.name,
      hostAddr: this.ship.hostAddr,
      result: this.ship.toJSON()
    };
  }

  onEdit(): void {
    this.edit.emit(this.resultDto);
  }

  onDelete(): void {
    this.delete.emit(this.resultDto);
  }

}
