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
  private users:any;
  private currentUser:any;

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
    let that = this;
    var t = that.userService.signinUser(that.loginForm.value);
    t.then((res) => {
      that.wrongCredentials = false;
      that.currentUser = that.userService.getUser(res.uid);
      that.userService.currentUserOnline(res.uid);
      that.users = that.userService.getAllUsers();
      for (let i = 0; i < that.users.length; i++) {
        if (that.users[i].friends) {
          for (let j = 0; j < Object.keys(that.users[i].friends).length; j++) {
            if (Object.keys(that.users[i].friends)[j] == that.currentUser.username && res.uid != that.users[i].uid) {
              that.userService.userOnline(that.users[i].uid,that.currentUser.username)
            }
          }
        }
      }
      that.userService.signedIn(true);
      that.router.navigate(['']);
    }).catch((error) => {
      that.wrongCredentials = true;
    });
  }

  onRegister() {
    this.router.navigate(['register']);
  }
}
