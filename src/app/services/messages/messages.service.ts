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

  setSender(sender: any, id: any) {
    this.sender$.emit({sender, id});
  }

  setRecipient(recipient: any, id: any) {
    this.recipient$.emit({recipient, id});
  }

  sendPersonalMessage(message:Object,index:any, sender:any, recipient:any) {
    localStorage.setItem(''+sender+"ID", index);
    firebase.database().ref(`Messages/Personal/Sender/${sender}/${index}`).update(message);
    firebase.database().ref(`Messages/Personal/Recipient/${recipient}/${index}`).update(message);
  }

  removePersonalMessage(name, id) {
    firebase.database().ref(`Messages/${name}/${id}`).remove();
  }

  getAllPersonalSenderMessages(uid: any) {
    let messages = [];
    firebase.database().ref(`Messages/Personal/Sender/${uid}`)
      .once('value', function(snapshot) {
        if(snapshot.val()) {
          let total = Object.keys(snapshot.val()).length;
          localStorage.setItem('personalMessageTotal', total.toString());
          for (let i = 0; i < total; i++) {
            let tuple = {};
            let id = Object(Object.keys(snapshot.val())[i]);
            tuple["personalSender"] = snapshot.val()[i].personalSender;
            tuple["recipient"] = snapshot.val()[i].recipient;
            tuple["personalMessage"] = snapshot.val()[i].personalMessage;
            tuple["time"] = snapshot.val()[i].time;
            messages.push(tuple);
          }
        }
      });
    messages = [];
    return messages;
  }

  getAllPersonalRecipientMessages(uid: any) {
    let messages = [];
    firebase.database().ref(`Messages/Personal/Recipient/${uid}`)
      .once('value', function(snapshot) {
        if(snapshot.val()) {
          let total = Object.keys(snapshot.val()).length;
          localStorage.setItem('personalMessageTotal', total.toString());
          for (let i = 0; i < total; i++) {
            let tuple = {};
            let id = Object(Object.keys(snapshot.val())[i]);
            tuple["personalSender"] = snapshot.val()[i].personalSender;
            tuple["recipient"] = snapshot.val()[i].recipient;
            tuple["personalMessage"] = snapshot.val()[i].personalMessage;
            tuple["time"] = snapshot.val()[i].time;
            messages.push(tuple);
          }
        }
      });
    // messages = [];

    return messages;
  }
}
