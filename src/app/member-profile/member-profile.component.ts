import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../services/user/user.service";

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.css']
})
export class MemberProfileComponent implements OnInit {
  private username:string;
  private imageSrc:string;
  private users:any;
  private friendStatus: string;
  private user: any;
  private uid: any;
  private currentUser: any

  constructor(private route:ActivatedRoute, private userService:UserService) {
    if (this.userService.isAuthenticated()) {
      this.user = this.userService.getCurrentUser();
      this.currentUser = this.userService.getUser(this.user.uid);
      let that = this;
      that.route.snapshot.params["matrixParameterName"];
      that.route.params.subscribe(matrixParams =>
        that.username = matrixParams["id"]);
      that.users = that.userService.getAllUsers();
      for (let i = 0; i < that.users.length; i++) {
        if (that.users[i].username == that.username) {
          that.imageSrc = that.users[i].profileImg;
          that.uid = that.users[i].uid;
          if (that.users[i].friends) {
            for (let j = 0; j < Object.keys(that.users[i].friends).length; j++) {
              if (Object.keys(that.users[i].friends)[j] == this.currentUser.username) {
                this.friendStatus = "Friend";
              }
            }
          }
          else if (that.users[i].requests) {
            for (let j = 0; j < Object.keys(that.users[i].requests).length; j++) {
              if (Object.keys(that.users[i].requests)[j] == this.currentUser.username) {
                this.friendStatus = "Pending";
              }
            }
          }
          else {
            this.friendStatus = "Not Friend";
          }
        }
      }
    }
  }

  ngOnInit() {
  }

  addFriend() {
    this.friendStatus = "Pending";
    let fullUid = ""
    for(let i =0; i<this.uid.length; i++) {
      fullUid += this.uid[i];
    }

    let tuple = {}
    tuple["name"] = this.currentUser.username;
    tuple["accept"] = false;
    console.log(fullUid);
    this.userService.addFriend(fullUid,tuple)
  }
}
