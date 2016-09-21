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
  private currentUserFriends: any;
  private otherUserFriends: any;
  private otherUserRequests: any;

  constructor(private route:ActivatedRoute, private userService:UserService) {
    let that = this;
    if (this.userService.isAuthenticated()) {
      that.user = this.userService.getCurrentUser();
      that.currentUser = this.userService.getUser(this.user.uid);
      that.currentUserFriends = [];
      that.otherUserFriends = [];
      that.otherUserRequests = [];

      that.route.snapshot.params["matrixParameterName"];
      that.route.params.subscribe(matrixParams =>
        that.username = matrixParams["id"]);
      that.users = that.userService.getAllUsers();
      for (let i = 0; i < that.users.length; i++) {
        if (that.users[i].username == that.username) {
          that.imageSrc = that.users[i].profileImg;
          that.uid = that.users[i].uid;
          that.userToRemove = that.users[i].username;

          if(that.users[i].friends != null && that.currentUser.friends != null)
          {
            that.otherUserFriends =  Object.keys(that.users[i].friends).map(function (key) {return that.users[i].friends[key]});
            that.currentUserFriends =  Object.keys(that.currentUser.friends).map(function (key) {return that.currentUser.friends[key]});

            outerloop:for(let j=0; j<that.otherUserFriends.length; j++) {
              if(that.otherUserFriends[j].name == that.currentUser.username) {
                for(let k=0; k<that.currentUserFriends.length;k++) {
                  if(that.currentUserFriends[k].name == that.users[i].username) {
                    this.friendStatus = "Friend";
                    this.isFriend = true;
                    break outerloop;
                  }
                  else if (that.users[i].requests != null) {
                    that.otherUserRequests =  Object.keys(that.users[i].requests).map(function (key) {return that.users[i].requests[key]});
                    for(let l =0; l<that.otherUserRequests.length;l++) {
                      if(that.otherUserRequests[l].name == that.currentUser.username) {
                        this.friendStatus = "Pending";
                        this.isFriend = null;
                        break outerloop;
                      }
                    }
                  }
                  else {
                    that.friendStatus = "Not Friend";
                    that.isFriend = false;
                  }
                }
              }
              else if (that.users[i].requests != null) {
                that.otherUserRequests =  Object.keys(that.users[i].requests).map(function (key) {return that.users[i].requests[key]});
                for(let l =0; l<that.otherUserRequests.length;l++) {
                  if(that.otherUserRequests[l].name == that.currentUser.username) {
                    this.friendStatus = "Pending";
                    this.isFriend = null;
                    break outerloop;
                  }
                }
              }
              else if(that.otherUserFriends[j].name != that.currentUser.username) {
                that.friendStatus = "Not Friend";
                that.isFriend = false;
              }
            }
          }
          else if (that.users[i].requests != null) {
            console.log("Request not null");
            console.log(that.users[i].requests.length);
            that.otherUserRequests =  Object.keys(that.users[i].requests).map(function (key) {return that.users[i].requests[key]});
            for(let l =0; l<that.otherUserRequests.length;l++) {
              console.log(l)
              console.log(that.otherUserRequests[l].name)
              if(that.otherUserRequests[l].name == that.currentUser.username) {
                console.log("There is a request for "+that.otherUserRequests[l].name);
                this.friendStatus = "Pending";
                this.isFriend = null;
              }
              else {
                console.log("there is no request :(")
              }
            }
          }
          else {
            console.log("Boo no friends")
            that.friendStatus = "Not Friend";
            that.isFriend = false;
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
    let removeTuple = {}
    removeTuple["name"] = this.currentUser.username;
    removeTuple["accept"] = false;

    this.userService.removeFriend(this.user.uid,tuple)
    this.userService.removeFriend(fullUid,removeTuple)
    this.isFriend = false;
  }
}
