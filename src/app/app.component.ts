import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'chatlive';
  check = true;
  loggedUser:any;
  ngOnInit() {
    this.loggedUser = JSON.parse(localStorage.getItem('user'));
    if(this.loggedUser !== null){
      this.check= false;
    }
  }
  login(formdata: any){
    console.log(formdata);
    if(formdata.username && formdata.user_id){
      localStorage.setItem('user', JSON.stringify(formdata));
      this.check = false;
      location.reload();
    } else {
      alert(`Enter username and user_id`);
    }
  }
}
