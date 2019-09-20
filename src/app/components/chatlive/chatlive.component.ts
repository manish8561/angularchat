import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChatliveService } from './chatlive.service';
import { element } from 'protractor';

@Component({
  selector: 'app-chatlive',
  templateUrl: './chatlive.component.html',
  styleUrls: ['./chatlive.component.scss'],
  providers: [ChatliveService]
})
export class ChatliveComponent implements OnInit {
  display = false;
  admindisplay = false;
  room = 'default';
  message: String;
  sendMsg: any;
  messageArray: Array<{ user: String, message: String }> = [];
  loggedUser: any;
  liveUsers = [];
  joinedUser = 0;
  usercount = 0;
  usertyping = false;
  userMinimize = true;
  @ViewChild('messagebody', { static: false }) myDiv: ElementRef;
  constructor(private _chatservice: ChatliveService) {
    this.loggedUser = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    if (this.loggedUser !== null && this.loggedUser.user_id == 1) {
      this.admindisplay = true;
    }
  }
  open() {
    this._chatservice.openConnection();
    this.display = true;
    this.userMinimize = false;
    this._chatservice.newUserJoined()
      .subscribe(data =>
        this.addMessage(data)
        //this.messageArray.push(data)
      );
    this._chatservice.newTyping()
      .subscribe(data =>
        this.addTyping(data)
        //this.messageArray.push(data)
      );
    this._chatservice.userLeftRoom()
      .subscribe(data => {
        //console.log(data,'manish');
        this.addMessage(data);
        this.liveUsers.map((user, index) => {
          if (user.room == data.room) {
            this.liveUsers.splice(index, 1);
          }
        });
      });
    this._chatservice.newMessageRecevied().subscribe(data => {
      this.addMessage(data);
      // this.messageArray.push(data);      
      setTimeout(() => {
        if (this.admindisplay) {
          document.querySelectorAll('.messagebody').forEach(ele => {
            ele.scrollTop = ele.scrollHeight;
          });
        } else {
          this.myDiv.nativeElement.scrollTop = this.myDiv.nativeElement.scrollHeight + 10;
        }

      }, 200);
    }

    );
    if (this.loggedUser.user_id == 1) {
      this._chatservice.newUser()
        .subscribe(data => {
          let d: any = data;
          d.message = [];
          d.count = 1;
          d.msg = '';
          d.typing = false;
          d.minimize = false;
          //console.log(data, 'invitation');
          this.liveUsers = [...this.liveUsers, data];
        });
    }
  }
  addMessage(data) {
    this.messageArray.push(data);
    if (this.loggedUser.username != data.username) {
      this.usercount += 1;
    }
    this.liveUsers.map((user, index) => {
      if (user.room == data.room) {
        this.liveUsers[index].message = [...this.liveUsers[index].message, data];
        if (user.username == data.username) {
          this.liveUsers[index].count += 1;
        }
      }
    });
  }
  addTyping(data) {
    if (this.loggedUser.username != data.username) {
      this.usertyping = true;
      setTimeout(() => {
        this.usertyping = false;
      }, 4000);
    }
    this.liveUsers.map((user, index) => {
      if (user.room == data.room) {
        if (user.username == data.username) {
          this.liveUsers[index].typing = true;
          setTimeout(() => {
            this.liveUsers[index].typing = false;
          }, 4000);
        }
      }
    });
  }
  /* join() {
    this._chatservice.joinRoom();
  } */
  joinUser(user: any) {
    this.joinedUser = user.room;
    this.liveUsers.map((ele, index) => {
      if (ele.room == user.room) {
        if (ele.username == user.username) {
          this.liveUsers[index].count = 0;
        }
      }
    });
    this._chatservice.joinUserRoom(user.room, this.liveUsers);
  }
  typingMsg($event, user: any = {}) {
    if (this.admindisplay) {
      const msg = $event.target.value;
      if (msg.length > 0) {
        this._chatservice.typingMsg(this.joinedUser);
      }
    } else {
      const data = {
        username: this.loggedUser.username,
        room: this.loggedUser.user_id,
        created_at: new Date()
      };
      this._chatservice.typingMsg(data.room);
    }
  }
  leave() {
    this.display = false;
    const data = {
      username: this.loggedUser.username,
      room: this.loggedUser.user_id,
      created_at: new Date()
    };
    this._chatservice.leaveRoom(data);
  }
  leaveUser() {
    const data = {
      username: this.loggedUser.username,
      room: this.joinedUser,
      created_at: new Date()
    };
    this.liveUsers.map((user, index) => {
      if (user.room == data.room) {
        this.liveUsers.splice(index, 1);
      }
    });
    this._chatservice.leaveRoom(data);
  }
  userFocus() {
    this.usercount = 0;
  }
  sendMessage() {
    this.usercount = 0;
    const data = {
      username: this.loggedUser.username,
      room: this.loggedUser.user_id,
      created_at: new Date(),
      message: this.message
    };
    if (this.message != '') {
      this._chatservice.sendMessage(data);
      this.message = '';
    }

  }
  adminSendMessage() {
    let msg = '';
    this.liveUsers.map((ele, index) => {
      if (ele.room == this.joinedUser) {
        msg = ele.msg;
        ele.msg = '';
      }
    });

    const data = {
      username: this.loggedUser.username,
      room: this.joinedUser,
      created_at: new Date(),
      message: msg
    };
    if (msg != '') {
      this._chatservice.sendMessage(data);
    }
  }

  keySend($event, user = {}) {
    // if the letter is not digit then display error and don't type anything
    this.typingMsg($event, user);
    const keysValue = [13];
    // console.log($event.which, keysValue.indexOf($event.which));
    if (keysValue.indexOf($event.which) > -1) {
      if (this.loggedUser.user_id == 1) {
        this.adminSendMessage();
      } else {
        this.sendMessage();
      }
    }

  }
  minimizeChat() {
    this.userMinimize = !this.userMinimize;
  }
  minimizeAdmin(user) {
    this.liveUsers.map((ele, index) => {
      if (ele.room == user.room) {
        ele.minimize = !ele.minimize;
      }
    });
  }
}
