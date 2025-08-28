import { Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { AdminComponent } from "./components/admin/admin.component";

export const routes: Routes = [
  {
    title: "Login",
    path: "login",
    component: LoginComponent,
  },

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
