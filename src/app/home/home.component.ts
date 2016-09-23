import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/user/user.service";
import {FileReaderEvent} from "../shared/fileReaderEvent.interface";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private isFile: boolean;
  filesToUpload: File;
  private fileName:string;
  private imgSrc: any;
  private imgTooBig: boolean;
  private currentUser: any;
  private user: any;
  constructor(private router: Router, private userService: UserService) {
    if(!this.userService.isAuthenticated())
    {
      this.router.navigate(['login']);
    }

    this.isFile = false;
  }

  ngOnInit() {
  }

  onUpload() {
    this.userService.uploadFile(this.filesToUpload, this.fileName, this.user.uid);
    this.userService.signInItem$.emit();
  }

  getFile(event) {
    let that = this;
    let imageFile = event.target.files[0];
    console.log(imageFile)
    let img = new Image();
    let reader = new FileReader();
    reader.addEventListener("load", (fre:FileReaderEvent) => {
      img.src = fre.target.result;
      img.addEventListener('load', function () {
        if(this.width > 800 && this.height > 800) {
          that.isFile = false;
          that.imgTooBig = true;
        }
        else {
          that.imgTooBig = false;
        }
      });
      that.imgSrc = img.src
    }, false);

    reader.readAsDataURL(imageFile);
    that.user = that.userService.getCurrentUser();
    that.currentUser = that.userService.getUser(that.user.uid);
      that.filesToUpload = imageFile;
      console.log(that.currentUser)
      that.fileName =  that.currentUser.username+ ".jpg";
      that.isFile = true;

  }
}
