import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router} from "@angular/router";
import {FormGroup, FormBuilder} from "@angular/forms";
import {UserService} from "../services/user/user.service";
import {FileReaderEvent} from "../shared/fileReaderEvent.interface";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private fileForm:FormGroup;
  private file: string;
  private isFile: boolean;
  filesToUpload: File;
  private fileName:string;
  private imgSrc: any;
  private imgTooBig: boolean;
  constructor(private router: Router, private formBuilder: FormBuilder, private userService: UserService, private ref: ChangeDetectorRef) {
    if(!this.userService.isAuthenticated())
    {
      this.router.navigate(['login']);
    }
    this.isFile = false;

    this.fileForm = formBuilder.group({
      'file': ['',[
        // Validators.required,
      ]]
    });
    // setInterval(() => {
    // the following is required, otherwise the view will not be updated

  // }, 1000);
  }

  ngOnInit() {
  }

  onUpload() {
    this.userService.uploadFile(this.filesToUpload, this.fileName);
  }

  getFile(event) {
    let that = this;
    let imageFile = event.target.files[0];
    var img = new Image();
    var reader = new FileReader();
    reader.addEventListener("load", (fre:FileReaderEvent) => {
      img.src = fre.target.result;
      img.addEventListener('load', function () {
        if(this.width > 420 && this.height > 420) {
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
      this.filesToUpload = imageFile;
      this.fileName = localStorage.getItem('username') + ".jpg";
      this.isFile = true;
  }
}
