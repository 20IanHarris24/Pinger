import {IShipResult, ShipDto} from './api/pingapp-api.service';
import {Injectable} from '@angular/core';


@Injectable({providedIn: 'root'})
export class UtilityService {


  constructor() {
  }


  trackByShipResultId = (_: number, ship: IShipResult) => ship.id;
  trackByShipDtoId = (_: number, ship: ShipDto) => ship.id;
  trackByPage = (_: number, page: number) => page;


  getStatusClass(result: string): string {

    if (!result) return 'status-error';

    const lowerResult = result.toLowerCase();

    if (lowerResult.includes('success')) {
      return 'status-success';
    }
    if (lowerResult.includes('timedout')) {
      return 'status-timeout';
    }
    return 'status-error';
  }

  blurActiveElement(): void {
    const active = document.activeElement as HTMLElement | null;
    if (active?.blur) active.blur();
  }


}

