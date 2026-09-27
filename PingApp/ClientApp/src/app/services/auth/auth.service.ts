import { API_BASE_URL } from "../api/pingapp-api.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { ShipSocketService } from "../socket/ship.socket.service";



export interface AuthUser {
  userName: string;
  email: string;
  roles: string[];
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly _authenticated =
    new BehaviorSubject<boolean>(false);

  readonly isAuthenticated$ =
    this._authenticated.asObservable();

  private readonly _currentUser =
    new BehaviorSubject<AuthUser | null>(null);

  readonly currentUser$ =
    this._currentUser.asObservable();

  constructor(
    private readonly _http: HttpClient,
    private readonly _shipSocketService: ShipSocketService,
    @Inject(API_BASE_URL)
    private readonly _apiBaseUrl: string,
  ) {}

  login(userName: string, password: string): Observable<void> {
    return this._http.post<void>(
      `${this._apiBaseUrl}/api/Auth/login`,
      { userName, password },
      { withCredentials: true },
    ).pipe(
      tap(() => {
        this._authenticated.next(true);
        this._shipSocketService.startUpConnection();
      }),
    );
  }

  logout(): Observable<void> {
    return this._http.post<void>(
      `${this._apiBaseUrl}/api/Auth/logout`,
      {},
      { withCredentials: true },
    ).pipe(
      finalize(() => {
        this._currentUser.next(null);
        this._authenticated.next(false);
        this._shipSocketService.stopConnection();
      }),
    );
  }

  checkSession(): Observable<boolean> {
    return this._http.get<AuthUser>(
      `${this._apiBaseUrl}/api/Auth/me`,
      { withCredentials: true },
    ).pipe(
      tap((user) => {
        this._currentUser.next(user);
        this._authenticated.next(true);
        this._shipSocketService.startUpConnection();
      }),
      map(() => true),
      catchError(() => {
        this._currentUser.next(null);
        this._authenticated.next(false);
        return of(false);
      }),
    );
  }
}
