import {Injectable} from "@angular/core";
import {EventEmitter} from "@angular/common/src/facade/async";

declare var firebase: any;

@Injectable()
export class MessagesService {

  public user$: EventEmitter<any>;
  public sender$: EventEmitter<any>;
  public recipient$: EventEmitter<any>;

  constructor() {
    this.user$ = new EventEmitter();
    this.sender$ = new EventEmitter();
    this.recipient$ = new EventEmitter();
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
    firebase.database().ref(`Messages/Global/`).remove();
  }

  removeMessage(id) {
    firebase.database().ref(`Messages/Global/${id}`).remove();
  }

  setSender(sender: any, id: any, recipient:any) {
    this.sender$.emit({sender, id, recipient});
  }

  setRecipient(recipient: any, id: any) {
    this.recipient$.emit({recipient, id});
  }

  sendPersonalMessage(message:Object,index:any, sender:any, recipient:any) {
    localStorage.setItem(''+sender+"ID", index);
    firebase.database().ref(`Messages/Personal/Sender/${sender}/${recipient}/${index}`).update(message);
  }

  removePersonalMessage(name, id) {
    firebase.database().ref(`Messages/${name}/${id}`).remove();
  }

  getAllPersonalSenderMessages(sender: any, recipient: any) {
    let messages = [];
    firebase.database().ref(`Messages/Personal/Sender/${sender}/${recipient}`)
      .once('value', function(snapshot) {
        if(snapshot.val()) {
          let total = Object.keys(snapshot.val()).length;
          for (let i = 0; i < total; i++) {
            let tuple = {};
            let id = Object(Object.keys(snapshot.val())[i]);
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
            let id = Object(Object.keys(snapshot.val())[i]);
            tuple["name"] = snapshot.val()[i].name;
            tuple["sender"] = snapshot.val()[i].sender;
            tuple["message"] = snapshot.val()[i].message;
            tuple["time"] = snapshot.val()[i].time;
            messages.push(tuple);
          }
        }
      });
    // messages = [];

    return messages;
  }
}
