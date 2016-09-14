import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {UserService} from "../services/user/user.service";

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
  constructor(private router: Router, private formBuilder: FormBuilder, private userService: UserService) {
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
  }

  ngOnInit() {
  }

  onUpload() {
    this.userService.uploadFile(this.filesToUpload, this.fileName);
  }

  getFile(event) {
    let imageFile = event.target.files[0]
    this.filesToUpload = imageFile;
    this.fileName = localStorage.getItem('username') + ".jpg";
    this.isFile = true;
  }

}
