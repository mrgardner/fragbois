import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { RegisterComponent } from './register/register.component';
import { RegisterFormComponent } from './register/register-form/register-form.component';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HeaderBannerComponent } from './header-banner/header-banner.component';
import {UserService} from "./services/user/user.service";
import {routing} from "./app.routes";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import { ProfileComponent } from './profile/profile.component';
import {AuthGuard} from "./services/user/auth.guard";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginFormComponent,
    RegisterComponent,
    RegisterFormComponent,
    HomeComponent,
    NavMenuComponent,
    HeaderBannerComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing
  ],
  providers: [UserService, {provide: LocationStrategy, useClass: HashLocationStrategy}, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
