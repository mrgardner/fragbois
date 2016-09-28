import { Component, OnInit } from '@angular/core';
import {FormService} from "../services/form/form.service";
import {Router, ActivatedRoute} from "@angular/router";
import {UserService} from "../services/user/user.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  private sections: any;
  private threads: any;
  private showCreateThread: any;
  private threadText: any;
  private displayIcon: any;
  private user: any;
  private currentUser: any;

  constructor(private formService: FormService, private userService: UserService, private router: Router, private route: ActivatedRoute) {
    let that = this;
    that.sections = [];
    that.threads = [];
    that.threadText = [];
    that.displayIcon = [];

    if (this.userService.isAuthenticated()) {
      that.user = this.userService.getCurrentUser();
      that.currentUser = this.userService.getUser(this.user.uid);
    }

    that.sections = that.formService.getSections();
    that.showCreateThread = [];

    setTimeout(function () {
      for(let i = 0; i < that.sections.length; i++){
        that.threads[i] = that.formService.getThreads(that.sections[i].section);
      }
    },500);

    that.formService.createdThread$.subscribe(_ => {
      setTimeout(function () {
        for(let i = 0; i < that.sections.length; i++){
          that.threads[i] = that.formService.getThreads(that.sections[i].section);
          this.displayIcon = 'fa fa-plus-circle';
        }
      },500);
    })


  }

  ngOnInit() {
  }

  showCreateNewThread(i: any) {
    this.showCreateThread[i] = !this.showCreateThread[i];
    if(this.showCreateThread[i] == true)
    {
      this.displayIcon[i] = 'fa fa-minus-circle';
    }
    else {
      this.displayIcon[i] = 'fa fa-plus-circle';
    }
  }

  createNewThread(sectionTitle: string, text: string) {
    let tuple = {};
    tuple["thread"] = text;
    this.formService.createThread(tuple, text, sectionTitle);
    this.formService.createdThread();
  }

  onThreadPage(section:any, id: any) {
    this.router.navigate([section, id], { relativeTo: this.route });
  }

}
