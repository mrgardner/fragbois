import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user/user.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
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
  private recipients: any;
  private sender: any;
  private id: number = 0;
  private NUM_OF_MESSAGES: number = 50;


  constructor(private userService: UserService, private formBuilder:FormBuilder, private messagesService:MessagesService) {
    this.friendName = [];

    // localStorage.removeItem('personalMessageTotal')
    console.log(localStorage.getItem('personalMessageTotal'))


    setInterval(() =>  {
    if (this.userService.isAuthenticated()) {
      // this.sender = [];
      // this.recipients = [];
      this.user = this.userService.getCurrentUser();

      this.currentUser = this.userService.getUser(this.user.uid);
      // localStorage.removeItem(''+this.currentUser.username+"ID")
      if(localStorage.getItem(''+this.currentUser.username+"ID"))
      {
        this.id = parseInt(localStorage.getItem('personalMessageId'));
      }
      else {
        this.id = 0;
      }

      let that = this;

      if (that.currentUser.friends) {
        if(localStorage.getItem('sender') == that.currentUser.username) {
          this.sender = this.messagesService.getAllPersonalSenderMessages(localStorage.getItem('sender'));
        }


        if(localStorage.getItem('recipient')) {
          this.recipients = this.messagesService.getAllPersonalRecipientMessages(localStorage.getItem('recipient').toString());
        }
        that.friends = Object.keys(that.currentUser.friends).map(function (key) {
          return that.currentUser.friends[key]
        });
        that.numOfFriends = Object.keys(that.currentUser.friends).length;
      }
    }
    // else {
    //   this.sender = [];
    //   this.recipients = [];
    // }
    }, 1000);


  }

  ngOnInit() {
  }

  onMessageSend(name: string, text: any) {
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
    // this.sender = [];
    // this.recipients = [];
    this.date = new Date();
    console.log("name: " + name+ " text: "+text);
    let tuple = {};
    tuple["personalSender"] = this.currentUser.username;
    tuple["recipient"] = name;
    tuple["time"] = this.date;
    tuple["personalMessage"] = text;

    console.log(this.id);
    this.messagesService.sendPersonalMessage(tuple,this.id,this.currentUser.username , name );
    this.sender = this.messagesService.getAllPersonalSenderMessages(this.currentUser.username);
    this.recipients = this.messagesService.getAllPersonalRecipientMessages(name);
    this.id++;
    localStorage.setItem(''+this.currentUser.username+"ID",this.id.toString());
    localStorage.setItem('recipient',name.toString());
    localStorage.setItem('sender',this.currentUser.username.toString());
  }

  openChatWindow(name: any, id: any) {
    this.friendName[id] = name;
    document.getElementById('friendChatButton'+id).style.display = "block"
    document.getElementById('friendChat'+id).style.display = "block"
  }

  closeChatWindow(id: any) {
    document.getElementById('friendChatButton'+id).style.display = "none"
    document.getElementById('friendChat'+id).style.display = "none"
  }
}
