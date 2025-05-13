import { Component} from '@angular/core';
import { IShipModel } from '../../services/api/pingapp-api.service';
import {NgForOf, NgIf} from '@angular/common';
import {ButtonFunctionService} from '../../services/button.function.service';



@Component({
  selector: 'app-showAllShips',
  imports: [NgForOf, NgIf],
  templateUrl: 'show.all.ships.component.html',
  styleUrl: 'show.all.ships.component.scss',
})
export class ShowAllShipsComponent {
  ships: IShipModel[] = [];



  constructor(protected buttonServices: ButtonFunctionService)
  {
     this.buttonServices._allShips$.subscribe((ships)=>{
       this.ships = ships;

  });


}}
