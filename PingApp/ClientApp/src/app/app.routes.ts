import { AdminComponent } from "./components/admin/admin.component";
import { adminGuard }  from './services/auth/admin.guard';
import { AuthenticatedLayoutComponent } from "./components/authenticated-layout/authenticated-layout.component";
import { authGuard } from "./services/auth/auth.guard";
import { MonitorComponent } from "./components/monitor/monitor.component";
import { PortalComponent } from "./components/portal/portal.component";
import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    title: "Portal",
    path: "portal",
    component: PortalComponent,
  },

  {
    path: "",
    component: AuthenticatedLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        title: "Monitor",
        path: "monitor",
        component: MonitorComponent,
      },
      {
        title: "Admin",
        path: "admin",
        component: AdminComponent,
        canActivate: [adminGuard],
      },
    ],
  },

  {
    path: "**",
    redirectTo: "portal",
  }
];
