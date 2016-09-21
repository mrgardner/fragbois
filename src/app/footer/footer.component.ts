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
  private recipients: any;
  private sender: any;
  private id: number = 0;
  private NUM_OF_MESSAGES: number = 50;
  private testing: string;
  private loading: boolean;


  constructor(private userService: UserService, private messagesService:MessagesService) {
    let that = this;
    that.friendName = [];
    that.senderList = [];
    that.recipientList = [];


    // localStorage.removeItem('personalMessageTotal')
    console.log(localStorage.getItem('personalMessageTotal'))

    this.userService.signInItem$.subscribe(_ => {
      that.loading = true;
      setTimeout(function () {

        if (that.userService.isAuthenticated()) {
          that.user = that.userService.getCurrentUser();

          that.currentUser = that.userService.getUser(that.user.uid);
          // localStorage.removeItem(''+this.currentUser.username+"ID")
          if(localStorage.getItem(''+that.currentUser.username+"ID"))
          {
            that.id = parseInt(localStorage.getItem('personalMessageId'));
          }
          else {
            that.id = 0;
          }

          that.messagesService.sender$.subscribe((user) => {
              that.sender = that.messagesService.getAllPersonalSenderMessages(user.sender);
              that.senderList[user.id] = that.sender;
            console.log(that.senderList);
          });

          that.messagesService.recipient$.subscribe((user) => {
            that.recipients = that.messagesService.getAllPersonalRecipientMessages(user.recipient);
            that.recipientList[user.id] = that.recipients;
            console.log(that.recipientList);
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
    let uid = this.currentUser.username+"-"+name;
    if(localStorage.getItem(''+this.currentUser.username+"ID"))
    {
      if(this.id == this.NUM_OF_MESSAGES)
      {
        this.id = 0
        localStorage.setItem('personalMessageTotal', this.id.toString())

        for(let i =1; i < this.NUM_OF_MESSAGES; i ++){
          this.messagesService.removePersonalMessage(uid,i);
        }
      }
      else {
        this.id = parseInt(localStorage.getItem(''+this.currentUser.username+"ID"));
      }
    }
    else {
      this.id = 0;
    }
    this.date = new Date();
    console.log("name: " + name+ " text: "+text);
    let tuple = {};
    tuple["personalSender"] = this.currentUser.username;
    tuple["recipient"] = name;
    tuple["time"] = this.date;
    tuple["personalMessage"] = text;

    console.log(this.id);
    this.messagesService.sendPersonalMessage(tuple,this.id,this.currentUser.username , name );
    this.messagesService.setSender(this.currentUser.username, index);
    this.messagesService.setRecipient(name, index);
    this.id++;
    // localStorage.setItem(''+this.currentUser.username+"ID",this.id.toString());
    // localStorage.setItem('recipient',name.toString());
    // localStorage.setItem('sender',this.currentUser.username.toString());

  /** TODO To deal with the id for messages check if the object exists in database:
   *  TODO   1). if it exists get the length on array and set it to starting id;
   *  TODO   2). if It doesn't exist set id to 0
   *  TODO Store objects for message in database as Messages/Personal/Sender/${Sender Username}/${Recipient Username}/(list of messages)
  */
  }

  openChatWindow(name: any, id: any) {
    this.friendName[id] = name;
    document.getElementById('friendChatButton'+id).style.display = "block"
    document.getElementById('friendChat'+id).style.display = "block";
    this.messagesService.setSender(this.currentUser.username, id);
    this.messagesService.setRecipient(name, id);
  }

  closeChatWindow(id: any) {
    document.getElementById('friendChatButton'+id).style.display = "none"
    document.getElementById('friendChat'+id).style.display = "none"
  }

  isAuth() {
    return this.userService.isAuthenticated();
  }

  isSigned() {
    return this.userService.isSignedIn();
  }
}
