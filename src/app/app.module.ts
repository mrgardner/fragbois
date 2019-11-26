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
import {MessagesService} from "./services/messages/messages.service";
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { MembersComponent } from './members/members.component';
import { MemberProfileComponent } from './member-profile/member-profile.component';
import { FooterComponent } from './footer/footer.component';
import { FormComponent } from './form/form.component';
import {FormService} from "./services/form/form.service";
import { ThreadComponent } from './form/thread/thread.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {startFrom} from "./form/thread/thread.pipe";
import {EditProfileComponent} from "./profile/editProfile/edit-profile.component";
import {Ng2PaginationModule} from "ng2-pagination/index";

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
    ProfileComponent,
    ChatBoxComponent,
    MembersComponent,
    MemberProfileComponent,
    FooterComponent,
    FormComponent,
    ThreadComponent,
    startFrom,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    Ng2PaginationModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    NgbModule.forRoot()
  ],
  providers: [UserService, {provide: LocationStrategy, useClass: HashLocationStrategy}, AuthGuard, MessagesService, FormService],
  bootstrap: [AppComponent]
})
export class AppModule { }
