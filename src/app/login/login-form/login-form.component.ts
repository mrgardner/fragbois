import {Component, OnInit} from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  private loginForm:FormGroup;
  private wrongCredentials:boolean;

  constructor(private formBuilder:FormBuilder, private userService:UserService, private router:Router) {
    this.wrongCredentials = false;
    this.loginForm = formBuilder.group({
      'email': ['', [
        Validators.required,
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      ]],
      'password': ['', [
        Validators.required,
      ]]
    });
  }


  ngOnInit() {
  }

  onSignin() {
    var t = this.userService.signinUser(this.loginForm.value);
    t.then((res) => {
      this.wrongCredentials = false;
      localStorage.setItem('username', this.loginForm.value.email);
      this.router.navigate(['']);
    }).catch((error) => {
      this.wrongCredentials = true;
    });
  }

  onRegister() {
    this.router.navigate(['register']);
  }
}
