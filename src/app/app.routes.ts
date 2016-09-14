import { RouterModule, Routes } from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {RegisterComponent} from "./register/register.component";
import {ProfileComponent} from "./profile/profile.component";
import {AuthGuard} from "./services/user/auth.guard";

const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'profile', component: ProfileComponent,canActivate: [AuthGuard]}
];

export const routing = RouterModule.forRoot(APP_ROUTES);

