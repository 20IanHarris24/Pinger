import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { map, take } from "rxjs/operators";

import { AuthService } from "./auth.service";

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map((user) => {
      if (user?.roles.includes("Admin")) {
        return true;
      }

      return router.createUrlTree(["/monitor"]);
    }),
  );
};
