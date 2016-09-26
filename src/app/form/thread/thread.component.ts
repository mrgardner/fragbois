import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormService} from "../../services/form/form.service";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit {

  private threadTitle: string;
  private sectionTitle: string;
  private posts: any;
  private date: Date;
  private id: number;
  private user: any;
  private currentUser: any;
  private imageSrc: any;
  private imageName: any;
  private userDetails: any;
  private text: string;
  private allUsers: any;
  private authorColor: any;

  constructor(private route: ActivatedRoute, private formService: FormService, private userService: UserService) {
    let that = this;
    that.imageName = [];
    that.imageSrc = [];
    that.userDetails = [];
    that.allUsers = [];
    that.authorColor = [];
    that.text = "";
    that.route.snapshot.params["matrixParameterName"];
    that.route.params.subscribe(matrixParams => {
      that.threadTitle = matrixParams["thread"];
      that.sectionTitle = matrixParams["section"];
    });

    if(that.id == null)
    {
      that.id = 0;
    }

    if (this.userService.isAuthenticated()) {
      that.user = this.userService.getCurrentUser();
      that.currentUser = this.userService.getUser(this.user.uid);
      that.posts = [];
      that.userDetails = [];
      that.authorColor = [];
      that.posts = that.formService.getPosts(that.sectionTitle,that.threadTitle);
      that.userDetails = that.userService.getUser(that.user.uid);
      that.allUsers = that.userService.getAllUsers();
    }

    that.formService.postId$.subscribe(id => {

      that.id = id;

      setTimeout(function () {
        for(let i = 0; i< id; i++) {
          that.imageName[i] = that.posts[i].author+ ".jpg";
          that.userService.downloadFile(that.imageName[i]).getDownloadURL().then(function (url) {
            that.imageSrc[i] = url;
          }).catch(function (error) {
            that.imageSrc[i] = "https://firebasestorage.googleapis.com/v0/b/fragbois-b7c29.appspot.com/o/images%2Fidenticon.png?alt=media&token=949eb2a7-32d5-4603-9aac-e32cecdb43bd";
            // Handle any errors
            that.userService.updateProfileImg(that.user.uid,'https://firebasestorage.googleapis.com/v0/b/fragbois-b7c29.appspot.com/o/images%2Fidenticon.png?alt=media&token=949eb2a7-32d5-4603-9aac-e32cecdb43bd');
          })
          if(that.posts[i].role == "guest") {
            that.authorColor[i] = that.posts[i].role;
          }
          else if(that.posts[i].role == "admin") {
            that.authorColor[i] = that.posts[i].role;
          }
          else if(that.posts[i].role == "member") {
            that.authorColor[i] = that.posts[i].role;
          }
        }
        for(let i=0; i<that.allUsers.length; i++){
          if(that.allUsers[i].numberOfPosts == null) {
            that.allUsers[i].numberOfPosts = 0;
          }
          // if(that.allUsers[i].role === "admin") {
          //   // document.getElementById('testing'+j).style.color = "red";
          //   console.log("admin")
          //   that.authorColor[i] = that.allUsers[i].roleColor;
          // }
          // else if(that.allUsers[i].role === "member") {
          //   // document.getElementById('testing'+j).style.color = "blue";
          //   that.authorColor[i] = that.allUsers[i].roleColor;
          //   console.log("member");
          // }
          // else if(that.allUsers[i].role === "guest") {
          //   // document.getElementById('testing'+j).style.color = "green";
          //   that.authorColor[i] = that.allUsers[i].roleColor;
          //   console.log("guest");
          // }
          if(that.allUsers[i].numberOfPosts == null) {
            that.allUsers[i].numberOfPosts = 0;
          }
          // if(that.allUsers[i].role == null) {
          //   that.allUsers[i].role = "guest";
          // }
          if(that.allUsers[i].numberOfPosts == 0)
          {
            that.allUsers[i].postTitle = "Rookie"
          }
          else if (that.allUsers[i].numberOfPosts > 0 && that.allUsers[i].numberOfPosts < 10)
          {
            that.allUsers[i].postTitle = "Cool Cat"
          }
          else if (that.allUsers[i].numberOfPosts > 10 && that.allUsers[i].numberOfPosts < 20 )
          {
            that.allUsers[i].postTitle = "The Coolest Cat"
          }
          console.log(that.posts.length)
          // for(let j=0; j < that.posts.length;j++) {

          // }
        }
      },500);
    });

    that.formService.sentPost$.subscribe(_ => {
      that.posts = [];
      that.userDetails = [];
      that.userDetails = that.userService.getUser(that.user.uid);
      that.posts = that.formService.getPosts(that.sectionTitle,that.threadTitle);
      that.allUsers = that.userService.getAllUsers();
      for(let i=0; i<that.allUsers.length; i++){
        if(that.allUsers[i].numberOfPosts == null) {
          that.allUsers[i].numberOfPosts = 0;
        }
        if(that.userDetails.numberOfPosts == null) {
          that.userDetails.numberOfPosts = 0;
        }
        if(that.userDetails.numberOfPosts == 0)
        {
          that.userDetails.postTitle = "Rookie"
        }
        else if (that.userDetails.numberOfPosts > 0 && that.userDetails.numberOfPosts < 10)
        {
          that.userDetails.postTitle = "Cool Cat"
        }
        else if (that.userDetails.numberOfPosts > 10 && that.userDetails.numberOfPosts < 20 )
        {
          that.userDetails.postTitle = "The Coolest Cat"
        }
        for(let j=0; j < that.posts.length;j++) {
          if(that.allUsers[i].role == "guest") {
            console.log("Guest")
            that.authorColor[j] = "guest";
          }
          else if(that.allUsers[i].role == "member") {
            that.authorColor[j] = "member";
            console.log("member")
          }
          else if(that.allUsers[i].role == "admin") {
            that.authorColor[j] = "admin";
            console.log("admin")
          }
        }
      }
      setTimeout(function () {
        document.getElementById('post'+(that.id-1)).scrollIntoView();
      },500);
    });
  }

  ngOnInit() {
  }

  createPost(author: string, text: string) {let that = this;
    this.date = new Date();
    let tuple = {};
    tuple["author"] = this.currentUser.username;
    tuple["post"] = text;
    tuple["time"] = this.date;
    let postTuple = {};
    if(this.userDetails.numberOfPosts == null) {
      this.userDetails.numberOfPosts = 0;
    }
    if(this.userDetails.numberOfPosts == 0)
    {
      this.userDetails.postTitle = "Rookie"
    }
    else if (this.userDetails.numberOfPosts > 0 && this.userDetails.numberOfPosts < 10)
    {
      this.userDetails.postTitle = "Cool Cat"
    }
    else if (this.userDetails.numberOfPosts > 10 && this.userDetails.numberOfPosts < 20 )
    {
      this.userDetails.postTitle = "The Coolest Cat"
    }
    this.userDetails.numberOfPosts++;
    postTuple["numberOfPosts"] = this.userDetails.numberOfPosts;
    postTuple["postTitle"] = this.userDetails.postTitle;
    this.formService.createPost(tuple, this.threadTitle, this.sectionTitle, this.id);
    this.userService.updatePostCount(this.user.uid, postTuple);
    this.formService.sentPost();
    this.id++;

    setTimeout(function () {
      document.getElementById('post'+(that.id-1)).scrollIntoView();
    },500);
  }

}
