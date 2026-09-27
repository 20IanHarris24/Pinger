import { AsyncPipe } from "@angular/common";
import { AuthService } from "../../services/auth/auth.service";
import { Component } from "@angular/core";
import {map, Observable} from "rxjs";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-authenticated-layout",
  templateUrl: "./authenticated-layout.component.html",
  styleUrls: ["./authenticated-layout.component.scss"],
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
})
export class AuthenticatedLayoutComponent {

  readonly isAuthenticated$: Observable<boolean>;
  readonly isAdmin$: Observable<boolean>;

  constructor(
    private readonly _authService: AuthService,
    private readonly _router: Router,
  ) {
    this.isAuthenticated$ = this._authService.isAuthenticated$;
    this.isAdmin$ = this._authService.currentUser$.pipe(
      map((user) => user?.roles.includes("Admin") ?? false),
    );
  }

  logout(): void {
    this._authService.logout().subscribe({
      next: () => {
        this._router.navigateByUrl("/portal");
      },
      error: () => {
        this._router.navigateByUrl("/portal");
      },
    });
  }
}
