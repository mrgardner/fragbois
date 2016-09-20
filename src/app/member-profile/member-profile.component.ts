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
  private isFriend: boolean;
  private userToRemove: any;

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
          that.userToRemove = that.users[i].username;
          if (that.users[i].friends && that.currentUser.friends) {
            for (let j = 0; j < Object.keys(that.users[i].friends).length; j++) {
              for(let k=0; k<Object.keys(that.currentUser.friends).length;k++) {

                console.log("This "+ Object.keys(that.users[i].friends)[j] + " should match "+ that.currentUser.username +
                    "and this "+ Object.keys(that.currentUser.friends)[k] + " should match "+that.users[i].username);
                if (Object.keys(that.users[i].friends)[j] == that.currentUser.username && Object.keys(that.currentUser.friends)[k] == that.users[i].username) {
                  console.log("Score!");
                  this.friendStatus = "Friend";
                  this.isFriend = true;
                  break;

                }
                else if (that.users[i].requests) {
                  for (let j = 0; j < Object.keys(that.users[i].requests).length; j++) {
                    if (Object.keys(that.users[i].requests)[j] == this.currentUser.username) {
                      this.friendStatus = "Pending";
                      this.isFriend = null;
                      break;

                    }
                  }
                }
                else {
                  this.friendStatus = "Not Friend";
                  this.isFriend = false;
                }
              }

            }
          }

          else if (that.users[i].requests != null ) {
            this.friendStatus = "Pending";
            this.isFriend = null;
          }
          else {
            this.friendStatus = "Not Friend";
            this.isFriend = false;
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
    this.isFriend = null
  }

  removeFriend() {
    this.friendStatus = "Not Friend";
    let fullUid = ""
    for(let i =0; i<this.uid.length; i++) {
      fullUid += this.uid[i];
    }

    let tuple = {}
    tuple["name"] = this.userToRemove;
    tuple["accept"] = false;
    console.log(this.userToRemove);
    this.userService.removeFriend(this.user.uid,tuple)
    this.isFriend = false;
  }
}
