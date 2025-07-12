import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';


export type DeleteStatus = 'idle' | 'deleting' | 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class ShipDeleteService {
  private _deleteStatus$ = new BehaviorSubject<DeleteStatus>('idle');
  private _deleteErrorMessage$ = new BehaviorSubject<string>('');

  readonly deleteStatus$ = this._deleteStatus$.asObservable();
  readonly deleteErrorMessage$ = this._deleteErrorMessage$.asObservable();

  reset() {
    this._deleteStatus$.next('idle');
    this._deleteErrorMessage$.next('');
  }

  setError(message: string) {
    this._deleteStatus$.next('error');
    this._deleteErrorMessage$.next(message);
  }

  markDeleting() {
    this._deleteStatus$.next('deleting');
  }

  markSuccess() {
    this._deleteStatus$.next('success');
  }
}
