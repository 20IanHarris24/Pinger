import {IShipResult} from './api/pingapp-api.service';
import {Injectable} from '@angular/core';


@Injectable({providedIn: 'root'})
export class UtilityService {


  constructor() {}


  getId(index: number, ship: IShipResult): string {
    return ship.id;
  }


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

