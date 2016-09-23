import { Component, OnInit } from '@angular/core';
import {FormService} from "../services/form/form.service";
import {Router, ActivatedRoute} from "@angular/router";

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

  constructor(private formService: FormService, private router: Router, private route: ActivatedRoute) {
    let that = this;
    that.sections = [];
    that.threads = [];
    that.threadText = [];

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
        }
      },500);
    })


  }

  ngOnInit() {
  }

  showCreateNewThread(i: any) {
    this.showCreateThread[i] = !this.showCreateThread[i];
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
