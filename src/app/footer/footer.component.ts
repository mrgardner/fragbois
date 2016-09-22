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
      },5000);
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
    setTimeout(function () {
      let objDiv = document.getElementById("chatterBox"+this.chatId);
      objDiv.scrollTop = objDiv.scrollHeight;
    },200);
    // console.log(this.chats);
    // that.chats = null;
  }

  openChatWindow(name: any, id: any) {

    if (this.chatId < 3) {
      this.friendName[this.chatId] = name;
      for(let i = 0; i<this.friendName.length;i++) {
        if(this.friendName[i] == name){
          console.log("OPENED NEW WINDOW");
          document.getElementById('friendChatButton'+(this.chatId)).style.display = "block"
          document.getElementById('friendChat'+(this.chatId)).style.display = "block";
          this.messagesService.setSender(this.currentUser.username, this.chatId, name);
          this.chatId++;
        }
        else {
          console.log("USER WINDOW ALREADY OPEN")
        }
      }


      console.log(this.chatId)
    }
    else {
      console.log("Too many chat windows open!!");
    }
    console.log(this.friendName)

  }

  closeChatWindow(id: any) {
    console.log(id%3)
    document.getElementById('friendChatButton'+(id%3)).style.display = "none"
    document.getElementById('friendChat'+(id%3)).style.display = "none"
    this.chatId--;
    console.log(this.chatId)
  }

  isAuth() {
    return this.userService.isAuthenticated();
  }

  isSigned() {
    return this.userService.isSignedIn();
  }
}
