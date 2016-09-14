import { Injectable } from "@angular/core";
import { User } from "./user.interface";
import {Router} from "@angular/router";

declare var firebase: any;

@Injectable()
export class UserService {
  private user: Object;
  private users: Array<Object>;
  private verifyUser: boolean;

  constructor(private router: Router) {

    this.users = [];
    this.verifyUser = true;

  }

  signupUser=(users: User) =>{
    let that = this;
    firebase.auth().createUserWithEmailAndPassword(users.email, users.password).then(function(user){
      that.createUserDB(users, user.uid);
      //Here if you want you can sign in the user
      firebase.auth().sendEmailVerification();
    }).catch(function(error) {
      //Handle error
    });
  }

  createUserDB(user: User, id: any) {
    let date = new Date(user.month + " "+ user.day + " " + user.year);
    let userDate = ("0" + (date.getMonth() + 1)).slice(-2) + "/"+date.getDate()+"/"+date.getFullYear();
    let age = Math.floor(Math.floor(Date.now() - +(new Date(userDate)))/(24*3600*1000*365));
    let tuple = {};
    tuple["username"] = user.username;
    tuple["firstName"] = user.firstName;
    tuple["lastName"] = user.lastName;
    tuple["email"] = user.email;
    tuple["dob"] = user.month + " "+ user.day + " " + user.year;
    tuple["age"] = age;
    tuple["password"] = user.password;
    tuple["gender"] = user.gender;
    firebase.database().ref(`Users/${id}`).update(tuple);
  }

  getUser(id:string) {
    let that = this;
    this.user = {};
      firebase.database().ref(`Users/${id}`)
        .on('value', function(snapshot) {
              that.user["username"] = snapshot.val().username;
              that.user["firstName"] = snapshot.val().firstName;
              that.user["lastName"] = snapshot.val().lastName;
              that.user["email"] = snapshot.val().email;
              that.user["dob"] = snapshot.val().dob;
              that.user["age"] = snapshot.val().age;
              that.user["password"] = snapshot.val().password;
              that.user["gender"] = snapshot.val().gender;
        });
    return that.user;
  }

  verifyUsername(username: string) {
    let that = this;
    firebase.database().ref(`Users/`)
      .on('value', function(snapshot) {
        let total = Object.keys(snapshot.val()).length;
        for(let i = 0; i < total; i++) {
            let id = Object(Object.keys(snapshot.val())[i]);
              if(username == snapshot.val()[id].username) {
                that.verifyUser = false;
              }
              else {
                that.verifyUser = true;
              }
        }
      });
    return that.verifyUser;
  }

  uploadFile(file:File, fileName:string) {
    var storageRef = firebase.storage().ref(`images/${fileName}`);
    storageRef.put(file);
  }

  downloadFile(fileName: string) {
    return firebase.storage().ref(`images/${fileName}`);
  }

  signinUser(user: User) {
    return firebase.auth().signInWithEmailAndPassword(user.email, user.password);
  }

  logout() {
    firebase.auth().signOut();
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    var user = firebase.auth().currentUser;

    if (user) {
      return true;
    } else {
      return false;
    }
  }

  getCurrentUser() {
    return firebase.auth().currentUser;
  }
}
