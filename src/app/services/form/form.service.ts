import {Injectable} from "@angular/core";
import {EventEmitter} from "@angular/common/src/facade/async";

declare var firebase: any;

@Injectable()
export class FormService {

  public postId$: EventEmitter<any>;
  public sentPost$: EventEmitter<any>;
  public createdThread$: EventEmitter<any>;

  constructor() {
    this.postId$ = new EventEmitter();
    this.sentPost$ = new EventEmitter();
    this.createdThread$ = new EventEmitter();
  }

  getSections() {
    let sections = [];
    firebase.database().ref(`Form/`)
      .once('value', function(snapshot) {
        if(snapshot.val()) {
          let total = Object.keys(snapshot.val()).length;
          for (let i = 0; i < total; i++) {
            let tuple = {};
            let id = Object(Object.keys(snapshot.val())[i]);
            tuple["section"] = snapshot.val()[id].section;
            sections.push(tuple);
          }
        }
      });
    return sections;
  }

  createThread(thead: any, threadTitle: string, sectionTitle: string) {
    firebase.database().ref(`Form/${sectionTitle}/${threadTitle}`).update(thead);
  }

  getThreads(section: string) {
    let thread = [];
    firebase.database().ref(`Form/${section}`)
      .once('value', function(snapshot) {
        if(snapshot.val()) {
          let total = Object.keys(snapshot.val()).length;
          for (let i = 0; i < total; i++) {
            let tuple = {};
            let id = Object(Object.keys(snapshot.val())[i]);
            tuple["thread"] = snapshot.val()[id].thread;
            thread.push(tuple);
          }
        }
      });
    return thread;
  }

  createPost(post: any, thread: string, section: string, id: number) {
    firebase.database().ref(`Form/${section}/${thread}/Posts/${id}`).update(post);
  }

  sentPost() {
    this.sentPost$.emit();
  }

  createdThread() {
    this.createdThread$.emit();
  }

  getPosts(section: string, thread: string) {
    let that = this;
    let posts = [];
    firebase.database().ref(`Form/${section}/${thread}/Posts`)
      .once('value', function(snapshot) {
        if(snapshot.val()) {
          let total = Object.keys(snapshot.val()).length;
          that.postId$.emit(total);
          for (let i = 0; i < total; i++) {
            let tuple = {};
            let id = Object(Object.keys(snapshot.val())[i]);
            tuple["post"] = snapshot.val()[id].post;
            tuple["author"] = snapshot.val()[id].author;
            tuple["time"] = snapshot.val()[id].time;
            posts.push(tuple);
          }
        }
      });
    return posts;
  }
}
