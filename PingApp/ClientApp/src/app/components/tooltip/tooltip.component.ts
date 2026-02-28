import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IShipStatusDto } from '../../services/api/pingapp-api.service';
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


  @Input() ship!: IShipStatusDto;
  @Input() isSelected: boolean = false;

  @Output() edit = new EventEmitter<IShipStatusDto>();
  @Output() delete = new EventEmitter<IShipStatusDto>();


  onEdit(): void {
    this.edit.emit(this.ship);
  }

  onDelete(): void {
    this.delete.emit(this.ship);
  }

}
