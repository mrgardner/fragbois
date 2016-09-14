import {Component, OnInit} from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder, Validator,
} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user/user.service";

declare var firebase: any;

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  private registerForm:FormGroup;
  private months:Array<string>;
  private days:Array<number>;
  private years:Array<number>;
  private users:Array<Object>;
  private userVerify: boolean;
  private userAvailable: boolean;
  public genders = [
    { value: 'Female', display: 'Female' },
    { value: 'Male', display: 'Male' },
    { value: 'Other', display: 'Other' }
  ];


  constructor(private formBuilder:FormBuilder, private userService: UserService, private router: Router) {
    this.userAvailable = null;
    this.users = [];
    this.userVerify = false;
    this.registerForm = formBuilder.group({
      'username': ['',[
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9]+$")
      ]],
      'firstName': ['',[
        Validators.required,
        Validators.pattern("^[a-zA-Z]+$")
      ]],
      'lastName': ['',[
        Validators.required,
        Validators.pattern("^[a-zA-Z]+$")
      ]],
      'email': ['',[
        Validators.required,
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      ]],
      'password': ['', [
        Validators.required
      ]],
      'confirmPassword': ['', [
        Validators.required
      ]],
      'month': ['', [
        Validators.required
      ]],
      'day': ['', [
        Validators.required
      ]],
      'year': ['', [
        Validators.required
      ]],
      'gender': ['', [
        Validators.required
      ]]
    }, {validator: this.matchingPasswords('password', 'confirmPassword')});

    this.months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    this.years = [2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999,1998,
                1997,1997,1996,1995,1994,1993,1992,1991,1990,1989,1988,1987,1986,1985,1984,1983,1982,1981,1980,
                1979,1978,1977,1976,1975,1974,1973,1972,1971,1970,1969,1968,1967,1966,1965,1964,1963,1962,1961,1960,
                1959,1958,1957,1956,1955,1954,1953,1952,1951,1950,1949,1948,1947,1946,1946,1945,1944,1943,1942,1941,1940,
                1939,1938,1937,1936,1935,1934,1933,1932,1931,1930,1929,1928,1927,1926,1925,1924,1923,1922,1921,1920,
                1919,1918,1917,1916,1915,1914,1913,1912,1911,1910,1909,1908,1907,1906,1905,1904,1903,1902,1901,1900];
  }



  ngOnInit() {
  }

  verifyUser(username:string) {
    let user = this.userService.verifyUsername(username);
    if(user) {
      this.userVerify = true;
      this.userAvailable = true
    }
    else {
      this.userVerify = false;
      this.userAvailable = false;
    }
  }

  onSignup() {
    console.log(this.registerForm.value)
    // this.userService.signupUser(this.registerForm.value);
    // this.router.navigate(['login']);
  }

  onMonthChange(monthName) {
    switch (monthName) {
      case "January":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        break;
      case "February":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
        break;
      case "March":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        break;
      case "April":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
        break;
      case "May":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        break;
      case "June":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
        break;
      case "July":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        break;
      case "August":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        break;
      case "September":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
        break;
      case "October":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        break;
      case "November":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
        break;
      case "December":
        this.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        break;
    }
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }
}
