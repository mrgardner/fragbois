import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/user/user.service";
import {MessagesService} from "../services/messages/messages.service";
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})

export class NavMenuComponent implements OnInit {
  private imageSrc: string;
  private imageName: string;
  private userDetails: any;
  private user: any;
  private test: string;
  private numOfNotifications: any;
  private showNotifications: boolean;
  private requests: any;
  private users: any;
  private uid: any;
  private currentUser: any;
  private username: any;
  private logoutUser:any;
  private loading: boolean;

  constructor(private router: Router, private userService: UserService) {
    let that = this;
    that.imageName = "";
    that.imageSrc = "";
    that.loading = true;

    this.userService.signInItem$.subscribe(_ => {
      console.log("Sign In");
      that.loading = true;
      setTimeout(function () {
        if(that.userService.isAuthenticated())
        {
          that.showNotifications = false;
          that.userDetails = {};
          that.user = that.userService.getCurrentUser();
          that.userDetails = that.userService.getUser(that.user.uid);
          that.test = that.userDetails.username;
          that.imageName = that.userDetails.email+ ".jpg";
          that.userService.downloadFile(that.imageName).getDownloadURL().then(function (url) {
            that.imageSrc = url;
            that.userService.updateProfileImg(that.user.uid,url);
          }).catch(function (error) {
            that.imageSrc = "https://firebasestorage.googleapis.com/v0/b/fragbois-b7c29.appspot.com/o/images%2Fidenticon.png?alt=media&token=949eb2a7-32d5-4603-9aac-e32cecdb43bd";
            // Handle any errors
            that.userService.updateProfileImg(that.user.uid,'https://firebasestorage.googleapis.com/v0/b/fragbois-b7c29.appspot.com/o/images%2Fidenticon.png?alt=media&token=949eb2a7-32d5-4603-9aac-e32cecdb43bd');
          })

          if(that.userDetails.requests)
          {
            that.requests =  Object.keys(that.userDetails.requests).map(function (key) {return that.userDetails.requests[key]});
            that.showNotifications = true;
            that.numOfNotifications = Object.keys(that.userDetails.requests).length;
          }

          that.users = that.userService.getAllUsers();
          for (let i = 0; i < that.users.length; i++) {
            if (that.users[i].username == that.username) {
              that.uid = that.users[i].uid;
            }
          }
          that.loading = false;
        }
      },5000);
    })
  }

  ngOnInit() {}

  isAuth() {
    return this.userService.isAuthenticated();
  }

  isSigned() {
    return this.userService.isSignedIn();
  }
  // if (Object.keys(that.users[i].friends)[j] == that.currentUser.username && res.uid != that.users[i].uid) {

  onLogout() {
    let that = this;
    this.imageName = "";
    // localStorage.removeItem('personalMessageTotal')
    // localStorage.removeItem('personalMessageId');
    this.userService.signedIn(false);
    that.logoutUser = that.userService.getUser(that.user.uid);
    that.users = that.userService.getAllUsers();
    for (let i = 0; i < that.users.length; i++) {
      if (that.users[i].friends) {
        for (let j = 0; j < Object.keys(that.users[i].friends).length; j++) {
          if (Object.keys(that.users[i].friends)[j] == that.logoutUser.username && that.user.uid != that.users[i].uid) {
            that.userService.userOffline(that.users[i].uid,that.logoutUser.username)
          }
        }
      }
    }
    this.userService.logout();
  }

  onMembers() {
    this.router.navigate(['members']);
  }

  goToProfile() {
    this.router.navigate(['profile']);
  }

  onHome() {
    this.router.navigate(['']);
  }

  onAccept(username: any) {
    let that = this;
    let requestTuple = {}
    requestTuple["name"] = username;
    requestTuple["accept"] = true;
    that.userService.acceptFriend(that.user.uid,requestTuple)
    let fullUid = ""
    for(let i =0; i<that.uid.length; i++) {
      fullUid += that.uid[i];
    }
    that.currentUser = that.userService.getUser(that.user.uid);
    let tuple = {}
    tuple["name"] = that.currentUser.username;
    tuple["accept"] = true;
    that.userService.acceptFriend(fullUid,tuple)
    that.userService.removeRequest(that.user.uid, requestTuple);
  }

  setUsername(username: any){
    this.username = username;
  }
}
