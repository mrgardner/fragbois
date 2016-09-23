import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user/user.service";
import {MessagesService} from "../services/messages/messages.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  private user: any;
  private date: Date;
  private friends: any;
  private currentUser: any;
  private numOfFriends: any;
  private friendName: any;
  private senderList: any;
  private recipientList: any;
  private recipient: any;
  private sender: any;
  private id: number;
  private windowId: number;
  private chats: any;
  private loading: boolean;
  private chatId: any;


  constructor(private userService: UserService, private messagesService:MessagesService) {
    let that = this;
    that.friendName = [];
    that.senderList = [];
    that.recipientList = [];
    that.chats = [];
    that.sender = [];
    that.recipient = [];
    that.id = 0;
    that.chatId = 0;
    that.windowId = 0;

    this.userService.signInItem$.subscribe(_ => {
      that.loading = true;
      setTimeout(function () {
        if (that.userService.isAuthenticated()) {
          that.user = that.userService.getCurrentUser();
          that.currentUser = that.userService.getUser(that.user.uid);
          that.messagesService.sender$.subscribe((user) => {
            that.sender = that.messagesService.getAllPersonalSenderMessages(user.sender, user.recipient);
            that.recipient = that.messagesService.getAllPersonalRecipientMessages(user.sender,user.recipient);
            // that.chats = [];
            setTimeout(function () {
              let t = that.recipient;
              that.senderList[user.id] = t.concat(that.sender).sort((function(a:any, b:any) {
                return +new Date(a.time) - +new Date(b.time);
              }));
            },200);
            setTimeout(function () {
              let objDiv = document.getElementById("chatterBox"+user.id);
              objDiv.scrollTop = objDiv.scrollHeight;
            },200);
          });
          that.friends = Object.keys(that.currentUser.friends).map(function (key) {
            return that.currentUser.friends[key]
          });
          that.numOfFriends = Object.keys(that.currentUser.friends).length;
          that.loading = false;
        }
      },3000);
    })
  }

  ngOnInit() {
  }

  onMessageSend(name: string, text: any, index: any) {
    let that = this;
    that.date = new Date();
    let tuple = {};
    tuple["sender"] = that.currentUser.username;
    tuple["name"] = name;
    tuple["time"] = that.date;
    tuple["message"] = text;
    if(that.sender.length > 0)
    {
      that.id = that.sender.length;
    }
    else {
      that.id = 0;
    }
    that.messagesService.sendPersonalMessage(tuple,that.id,that.currentUser.username , name );
    that.messagesService.setSender(that.currentUser.username, index, name);
  }

  openChatWindow(name: any, id: any) {


    let that = this;
    console.log("OPENED " +that.chatId)

    if (that.chatId < 3 && that.chatId >= 0) {
      if(this.friendName.length == 0) {
        this.friendName = [];
        console.log("BOOM");
        console.log(this.friendName);
        that.chatId =0;

      }
      else {
        // this.friendName[that.chatId] = name;
      }

      console.log("OPENED LIST: "+that.friendName)
        if(!that.duplicates(that.friendName)) {
          this.friendName[that.chatId] = name;
          document.getElementById('friendChatButton'+(that.chatId)).style.display = "block"
          document.getElementById('friendChat'+(that.chatId)).style.display = "block";
          that.messagesService.setSender(that.currentUser.username, that.chatId, name);
          this.chatId++;
        }
      }
  }

  closeChatWindow(id: any) {
    console.log(id)
    let that = this;
    if(that.chatId < 4 && that.chatId >= 0){
      console.log(id)
      document.getElementById('friendChatButton'+(id)).style.display = "none"
      document.getElementById('friendChat'+(id)).style.display = "none"

      if ((id) > -1) {
        if(that.friendName.length > 1) {
          that.friendName.splice((id), 1);
          console.log(that.friendName.length)
          // for(let i=0; i<that.friendName.length; i++){
          //   console.log(that.friendName[i]);
          //   that.friendName[id] = that.friendName[i];
          //
          //   console.log(that.friendName);
          // }
          that.chatId = id;
        }
        else {
          that.friendName = [];
        }

        // this.friendName[id] = undefined;
        // that.messagesService.setSender(that.currentUser.username, id, this.friendName[id]);
        console.log(that.friendName.length)
      }
    }
    console.log("CLOSED LIST: "+that.friendName)
    console.log("CLOSED " +that.chatId)
  }
  duplicates (a) {
  var counts = [];
  for(var i = 0; i <= a.length; i++) {
    if(counts[a[i]] === undefined) {
      counts[a[i]] = 1;
    } else {
      return true;
    }
  }
  return false;
}

  isAuth() {
    return this.userService.isAuthenticated();
  }

  isSigned() {
    return this.userService.isSignedIn();
  }
}
