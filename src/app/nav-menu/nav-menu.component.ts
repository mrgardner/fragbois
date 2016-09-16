import {Component, OnInit, NgZone, ChangeDetectorRef} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/user/user.service";
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})


export class NavMenuComponent implements OnInit {
  private imageSrc: string;
  private imageName: string;
  private userDetails: any;

  constructor(private router: Router, private userService: UserService, private ref: ChangeDetectorRef, private zone: NgZone) {

      let that = this;
      that.imageName = "";
      if(this.userService.isAuthenticated())
      {
        this.userDetails = {};
        let user = this.userService.getCurrentUser();
        this.userDetails = this.userService.getUser(user.uid);
        that.imageName = this.userDetails.email+ ".jpg";
        this.userService.downloadFile(that.imageName).getDownloadURL().then(function (url) {
          that.imageSrc = url;
        }).catch(function (error) {
          that.imageSrc = "https://firebasestorage.googleapis.com/v0/b/fragbois-b7c29.appspot.com/o/images%2Fidenticon.png?alt=media&token=949eb2a7-32d5-4603-9aac-e32cecdb43bd";
          // Handle any errors
        })
      }

  }

  ngOnInit() {

  }

  isAuth() {
    return this.userService.isAuthenticated();
  }

  isSigned() {
    return this.userService.isSignedIn();
  }

  onLogout() {
    this.imageName = "";
    this.userService.signedIn(false);
    this.userService.logout();
  }

  goToProfile() {
    this.router.navigate(['profile']);
  }

}
