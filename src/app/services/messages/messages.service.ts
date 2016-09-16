import {Injectable, ElementRef} from "@angular/core";

declare var firebase: any;

@Injectable()
export class MessagesService {

  constructor() {
  }

  sendMessage(message:Object, id:any) {
    localStorage.setItem('id', id);
    firebase.database().ref(`Messages/${id}`).update(message);
  }

  getAllMessages() {
    let messages = [];
    firebase.database().ref(`Messages/`)
      .once('value', function(snapshot) {
        if(snapshot.val()) {
          let total = Object.keys(snapshot.val()).length;
          localStorage.setItem('total', total.toString());
          for (let i = 0; i < total; i++) {
            let tuple = {};
            let id = Object(Object.keys(snapshot.val())[i]);
            tuple["sender"] = snapshot.val()[i].sender;
            tuple["message"] = snapshot.val()[i].message;
            tuple["time"] = snapshot.val()[i].time;
            messages.push(tuple);
          }
        }
        else {
          localStorage.removeItem('total');
        }

      });
    messages = [];
    return messages;
  }

  removeMessages(){
    firebase.database().ref(`Messages/`).remove();
  }

  removeMessage(id) {
    firebase.database().ref(`Messages/${id}`).remove();
  }
}
