import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user/user.service";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  private members: any;
  private imageSrc: string;
  private imageName: string;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {
    let that = this;
    that.members = [];
    that.imageName = "";
    that.imageSrc = "";

    if(that.userService.isAuthenticated())
    {
      that.members = that.userService.getAllUsers();
    }
  }

  ngOnInit() {
  }

  onMemberProfile(id: any){
    this.router.navigate([id], { relativeTo: this.route });
  }

}
