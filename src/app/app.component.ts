import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'chatlive';
  check = true;
  username: any;
  ngOnInit() {
    this.username = localStorage.getItem('username');
    if (this.username !== null) {
      this.check = false;
    }
  }
  login(formdata: any) {
    console.log(formdata);
    if (formdata.username && formdata.user_id) {
      localStorage.setItem('username', formdata.username);
      localStorage.setItem('user_room', formdata.user_id);
      this.check = false;
      location.reload();
    } else {
      alert(`Enter username and user_id`);
    }
  }
}
