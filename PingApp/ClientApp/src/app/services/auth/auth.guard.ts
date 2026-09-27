import { AuthService } from "../auth/auth.service";
import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { map } from "rxjs/operators";

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkSession().pipe(
    map((authenticated) => {
      if (authenticated) {
        return true;
      }

      return router.createUrlTree(
        ["/portal"],
        {
          queryParams: {
            returnUrl: state.url,
          },
        },
      );
    }),
  );
};
