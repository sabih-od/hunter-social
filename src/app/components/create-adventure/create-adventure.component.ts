import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-adventure',
  templateUrl: './create-adventure.component.html',
  styleUrls: ['./create-adventure.component.scss'],
})
export class CreateAdventureComponent implements OnInit {

  constructor(
    private users: UserService
  ) { }

  user_image;
  ngOnInit() {
    this.setUserImage();
  }

  async setUserImage() {
    let user = await this.users.getUser();
    this.user_image = user.profile_image;
  }

}
