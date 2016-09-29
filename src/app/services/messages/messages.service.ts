import {Injectable} from "@angular/core";
import {EventEmitter} from "@angular/common/src/facade/async";

declare var firebase: any;

@Injectable()
export class MessagesService {

  public sender$: EventEmitter<any>;

  constructor() {
    this.sender$ = new EventEmitter();
  }

  sendMessage(message:Object, id:any) {
    localStorage.setItem('id', id);
    firebase.database().ref(`Messages/Global/${id}`).update(message);
  }

  getAllMessages() {
    let messages = [];
    firebase.database().ref(`Messages/Global/`)
      .once('value', function(snapshot) {
        if(snapshot.val()) {
          let total = Object.keys(snapshot.val()).length;
          localStorage.setItem('total', total.toString());
          for (let i = 0; i < total; i++) {
            let tuple = {};
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
    firebase.database().ref(`Messages/Global/`).remove();
  }

  removeMessage(id) {
    firebase.database().ref(`Messages/Global/${id}`).remove();
  }

  setSender(sender: any, id: any, recipient:any) {
    this.sender$.emit({sender, id, recipient});
  }

  sendPersonalMessage(message:Object,index:any, sender:any, recipient:any) {
    localStorage.setItem(''+sender+"ID", index);
    firebase.database().ref(`Messages/Personal/Sender/${sender}/${recipient}/${index}`).update(message);
  }

  getAllPersonalSenderMessages(sender: any, recipient: any) {
    let messages = [];
    firebase.database().ref(`Messages/Personal/Sender/${sender}/${recipient}`)
      .once('value', function(snapshot) {
        if(snapshot.val()) {
          let total = Object.keys(snapshot.val()).length;
          for (let i = 0; i < total; i++) {
            let tuple = {};
            tuple["name"] = snapshot.val()[i].name;
            tuple["sender"] = snapshot.val()[i].sender;
            tuple["message"] = snapshot.val()[i].message;
            tuple["time"] = snapshot.val()[i].time;
            messages.push(tuple);
          }
        }
      });
    messages = [];
    return messages;
  }

  getAllPersonalRecipientMessages(sender: any, recipient: any) {
    let messages = [];
    firebase.database().ref(`Messages/Personal/Sender/${recipient}/${sender}`)
      .once('value', function(snapshot) {
        if(snapshot.val()) {
          let total = Object.keys(snapshot.val()).length;
          for (let i = 0; i < total; i++) {
            let tuple = {};
            tuple["name"] = snapshot.val()[i].name;
            tuple["sender"] = snapshot.val()[i].sender;
            tuple["message"] = snapshot.val()[i].message;
            tuple["time"] = snapshot.val()[i].time;
            messages.push(tuple);
          }
        }
      });
    messages = [];

    return messages;
  }
}
