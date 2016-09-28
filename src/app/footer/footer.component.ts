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
            console.log("RECIPIENT "+user.recipient)
            console.log("SENDER "+user.sender)
            setTimeout(function () {
              console.log(user.id)
              console.log(user.sender)
              console.log(user.recipient)

              console.log("Sedner List "+that.sender.length)
              console.log("Sedner List "+that.sender)
              console.log("RECIVERS LIST "+that.recipient.length)
              console.log("RECIVERS LIST "+that.recipient)
              that.senderList[user.id] = that.recipient.concat(that.sender).sort((function(a:any, b:any) {
                return +new Date(a.time) - +new Date(b.time);
              }));

              console.log(that.senderList[user.id]);
            },200);
            setTimeout(function () {
              let objDiv = document.getElementById("chatterBox"+user.id);
              objDiv.scrollTop = objDiv.scrollHeight;
            },200);
          });
          if(that.currentUser.friends != null) {
            that.friends = Object.keys(that.currentUser.friends).map(function (key) {
              return that.currentUser.friends[key]
            });
            that.numOfFriends = Object.keys(that.currentUser.friends).length;
          }
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
    console.log(that.friendName.length)
    if (that.chatId < 3 && that.chatId >= 0) {
      if(this.friendName.length == 0) {
        this.friendName = [];
        that.chatId =0;

      }
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
    let that = this;
    that.senderList = [];
    that.senderList = [];
    console.log(that.friendName[0]);
    console.log(id);
    if(that.chatId < 4 && that.chatId >= 0){
      if(that.friendName.length  == 3) {
        if(id == 0) {
          document.getElementById('friendChatButton'+(2)).style.display = "none";
          document.getElementById('friendChat'+(2)).style.display = "none";
          that.messagesService.setSender(that.currentUser.username, 0, that.friendName[1]);
          setTimeout(function () {
              that.messagesService.setSender(that.currentUser.username, 1, that.friendName[1]);
          },200)
        }
        else if(id == 1) {
          document.getElementById('friendChatButton'+(2)).style.display = "none";
          document.getElementById('friendChat'+(2)).style.display = "none";
          that.messagesService.setSender(that.currentUser.username, 0, that.friendName[0]);
          setTimeout(function () {
            that.messagesService.setSender(that.currentUser.username, 1, that.friendName[1]);
          },200)
        }
        else if(id == 2 ) {
          document.getElementById('friendChatButton'+(id)).style.display = "none";
          document.getElementById('friendChat'+(id)).style.display = "none";
          that.messagesService.setSender(that.currentUser.username, 0, that.friendName[0]);
          setTimeout(function () {
            that.messagesService.setSender(that.currentUser.username, 1, that.friendName[1]);
          },200)
        }
      }
      else if(that.friendName.length  == 2) {
        if(id == 0) {
          document.getElementById('friendChatButton'+(1)).style.display = "none";
          document.getElementById('friendChat'+(1)).style.display = "none";
          that.messagesService.setSender(that.currentUser.username, 0, that.friendName[1]);
        }
        else if(id == 1) {
          document.getElementById('friendChatButton'+(id)).style.display = "none";
          document.getElementById('friendChat'+(id)).style.display = "none";
          that.messagesService.setSender(that.currentUser.username, 0, that.friendName[0]);
        }
      }
      else {
        document.getElementById('friendChatButton'+(id)).style.display = "none";
        document.getElementById('friendChat'+(id)).style.display = "none";
      }

      if ((id) > -1) {
        if(that.friendName.length > 1) {
          that.friendName.splice((id), 1);
          console.log(that.friendName)
          if(that.friendName.length < 2) {
            that.chatId = id;
          }
          else {
            if(id == 0)
            {
              that.chatId = id+2;
            }
            else {
              that.chatId = id+1;
            }
          }
        }
        else {
          that.friendName = [];
        }
      }
    }
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
