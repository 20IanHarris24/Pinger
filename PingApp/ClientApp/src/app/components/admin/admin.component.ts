import { Component} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ReactiveFormsModule } from '@angular/forms';
import { ManageShipComponent } from '../manage-ship/manage.ship.component';
import { ShowAllShipsComponent } from '../show-all-ships/show.all.ships.component';


@UntilDestroy()
@Component({
  selector: 'app-admin',
  templateUrl: 'admin.component.html',
  styleUrl: "admin.component.scss",
  imports: [ReactiveFormsModule, ManageShipComponent, ShowAllShipsComponent],
})
export class AdminComponent {

  constructor() {}




}
