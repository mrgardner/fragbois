import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessagesService} from "../services/messages/messages.service";
import {Router} from "@angular/router";
import {UserService} from "../services/user/user.service";

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit{

  private chatForm:FormGroup;
  private messages: Array<Object>;
  private id: number = 0;
  private date: Date;
  private NUM_OF_MESSAGES: number = 50;
  private chatTextArea: string;
  private showTimestamp: boolean
  private userDetails: any;

  constructor(private formBuilder:FormBuilder, private messagesService:MessagesService, private router:Router, private userService: UserService) {
    // console.log(this.el.nativeElement.getElementById('input').value);
    // document.getElementById("test").value;
    this.messages = [];
    this.showTimestamp = true;
    this.messages = this.messagesService.getAllMessages();
    this.userDetails = {};
    let user = this.userService.getCurrentUser();
    this.userDetails = this.userService.getUser(user.uid);

    if(localStorage.getItem('total'))
    {
      this.id = parseInt(localStorage.getItem('id'));
    }
    else {
      this.id = 0;
    }

    this.chatForm = formBuilder.group({
      'chatBox': ['', [
        Validators.required
      ]]
    });
  }

  hideTime() {
    this.showTimestamp = false;
  }

  showTime() {
    this.showTimestamp = true;
  }

  clearChat() {
    this.messagesService.removeMessages();
    this.messages = this.messagesService.getAllMessages();
  }

  ngOnInit() {}

  onMessageSend() {
    if(localStorage.getItem('total'))
    {
      if(this.id == this.NUM_OF_MESSAGES)
      {

        this.id = 0
        localStorage.setItem('total', this.id.toString())

        for(let i =1; i < this.NUM_OF_MESSAGES; i ++){
          this.messagesService.removeMessage(i);
        }

      }
      else {
        this.id = parseInt(localStorage.getItem('id'));
      }
    }
    else {
      this.id = 0;
    }
    this.messages = [];
    this.date = new Date();
    let tuple= {}
    tuple["message"] = this.chatForm.value.chatBox
    tuple["time"] = this.date
    tuple["sender"] = this.userDetails.username
    this.messagesService.sendMessage(tuple, this.id)
    this.messages = this.messagesService.getAllMessages();
    this.id++;
    localStorage.setItem('id',this.id.toString());
    this.chatTextArea = "";
  }
}
