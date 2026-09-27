import { Component} from '@angular/core';
import { ManageShipComponent } from '../manage-ship/manage.ship.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowAllShipsComponent } from '../show-all-ships/show.all.ships.component';
import { Title } from '@angular/platform-browser';
import { UntilDestroy } from '@ngneat/until-destroy';
import {ManageUserComponent} from '../manage-user/manage-user.component';


@UntilDestroy()
@Component({
  selector: 'app-admin',
  templateUrl: 'admin.component.html',
  styleUrls: ['admin.component.scss'],
  imports: [ReactiveFormsModule, ManageShipComponent, ManageUserComponent, ShowAllShipsComponent, PaginationComponent],
})

export class AdminComponent {

  constructor(private _titleService: Title)
  {
    this._titleService.setTitle("Admin · Pinger");
  }

}
