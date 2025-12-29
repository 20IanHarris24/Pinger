import { Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { AdminComponent } from "./components/admin/admin.component";

export const routes: Routes = [
  {
    title: "Home",
    path: "home",
    component: HomeComponent,
  },
  {
    title: "Admin",
    path: "admin",
    component: AdminComponent,
  },
  {
    path: "**",
    redirectTo: "home",
  },
];
