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

  constructor(private route: ActivatedRoute, private formService: FormService, private userService: UserService) {
    let that = this;
    that.imageName = [];
    that.imageSrc = [];
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
      that.posts = that.formService.getPosts(that.sectionTitle,that.threadTitle);
      that.userDetails = that.userService.getUser(that.user.uid);
    }

    that.formService.postId$.subscribe(id => {
      console.log(id)
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
        }
      },500);
    });

    that.formService.sentPost$.subscribe(_ => {
      that.posts = [];
      that.posts = that.formService.getPosts(that.sectionTitle,that.threadTitle);
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
    this.formService.createPost(tuple, this.threadTitle, this.sectionTitle, this.id);
    this.formService.sentPost();
    this.id++;
    setTimeout(function () {
      document.getElementById('post'+(that.id-1)).scrollIntoView();
    },500);
  }

}
