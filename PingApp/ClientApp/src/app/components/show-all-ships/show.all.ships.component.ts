import {Component, EventEmitter, Output} from '@angular/core';
import {ShipDto} from '../../services/api/pingapp-api.service';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {
  selectEditedShipId,
  selectNewlyAddedShipId, selectPaginatedShipViewModel
} from '../../state/selectors/ship.selectors';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {ActionService} from '../../services/action.service';
import {ReactiveFormsModule} from '@angular/forms';
import {SpinnerComponent} from '../spinner/spinner.component';
import {loadPaginatedShips} from '../../state/actions/ship.actions';
import {TooltipComponent} from '../tooltip/tooltip.component';
import {UtilityService} from '../../services/utility.service';


@Component({
  selector: 'app-showAllShips',
  imports: [NgForOf, NgIf, AsyncPipe, ReactiveFormsModule, SpinnerComponent, TooltipComponent],
  templateUrl: 'show.all.ships.component.html',
  styleUrl: 'show.all.ships.component.scss',
})

export class ShowAllShipsComponent {


  currentPage = 1;
  hoverIndex: number = -1;
  newlyAddedShipId$: Observable<string | null>;
  newlyEditedShipId$: Observable<string | null>;
  mouseAction: boolean = false;
  selectIndex: number = -1;
  ships: ShipDto[] = [];
  viewModel$: Observable<{
    ships: ShipDto[];
    loading: boolean;
  }>;


  @Output() openModal = new EventEmitter<void>();


  constructor(protected actionService: ActionService, private store: Store, protected utility: UtilityService) {


    this.viewModel$ = this.store.select(selectPaginatedShipViewModel);
    this.newlyAddedShipId$ = this.store.select(selectNewlyAddedShipId);
    this.newlyEditedShipId$ = this.store.select(selectEditedShipId);


  }


  ngOnInit(): void {
    this.store.dispatch(loadPaginatedShips({page: this.currentPage}));

  }

  onMouseClick(i: number) {
    this.selectIndex = i;
    this.mouseAction = true;
    this.openModal.emit();
  }

  onMouseOver(i: number) {
    this.hoverIndex = i;
    this.mouseAction = true;
  }

  onMouseOff() {
    this.hoverIndex = -1;
    this.mouseAction = false;
    this.selectIndex = -1;
  }

}
