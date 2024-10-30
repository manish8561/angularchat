import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ChatliveService } from "./chatlive.service";
import { element } from "protractor";

@Component({
  selector: "app-chatlive",
  templateUrl: "./chatlive.component.html",
  styleUrls: ["./chatlive.component.scss"],
  // providers: [ChatliveService]
})
export class ChatliveComponent implements OnInit {
  display = false;
  admindisplay = false;
  adminRoom = 1;
  room = "default";
  message: string;
  sendMsg: any;
  messageArray: Array<{
    user: string;
    message: string;
    created_at: Date;
    status: string;
  }> = [];
  username: any;
  userRoom: any;
  liveUsers = [];
  joinedUser = 0;
  usercount = 0;
  usertyping = false;
  userMinimize = true;

  @ViewChild("messagebody", { static: false }) myDiv: ElementRef;
  constructor(private chatService: ChatliveService) {
    this.adminRoom = chatService.options.adminRoom;
    this.username = localStorage.getItem("username");
    this.userRoom = localStorage.getItem("userRoom");
  }

  ngOnInit() {
    if (this.username !== null && this.userRoom === this.adminRoom) {
      this.admindisplay = true;
    }
  }
  open() {
    this.chatService.openConnection();
    this.display = true;
    this.userMinimize = false;
    this.chatService.newUserJoined().subscribe(
      (data) => this.addMessage(data)
      // this.messageArray.push(data)
    );
    this.chatService.newTyping().subscribe(
      (data) => this.addTyping(data)
      // this.messageArray.push(data)
    );
    this.chatService.userLeftRoom().subscribe((data) => {
      // console.log(data,'manish');
      this.addMessage(data);
      this.liveUsers.map((user, index) => {
        if (user.room === data.room) {
          this.liveUsers.splice(index, 1);
        }
      });
    });
    this.chatService.newMessageRecevied().subscribe((data) => {
      this.addMessage(data);
      // this.messageArray.push(data);
      setTimeout(() => {
        if (this.admindisplay) {
          document.querySelectorAll(".messagebody").forEach((ele) => {
            ele.scrollTop = ele.scrollHeight;
          });
        } else {
          this.myDiv.nativeElement.scrollTop =
            this.myDiv.nativeElement.scrollHeight + 10;
        }
      }, 200);
    });
    if (this.userRoom === this.adminRoom) {
      this.chatService.newUser().subscribe((data) => {
        const d: any = data;
        d.message = [];
        d.count = 1;
        d.msg = "";
        d.typing = false;
        d.minimize = false;

        // console.log(data, 'invitation');
        this.liveUsers = [...this.liveUsers, data];
      });
    }
  }
  addMessage(data) {
    data.status = "unseen";
    this.messageArray.push(data);
    if (this.username !== data.username) {
      this.usercount += 1;
    }
    this.liveUsers.map((user, index) => {
      if (user.room === data.room) {
        this.liveUsers[index].message = [
          ...this.liveUsers[index].message,
          data,
        ];
        if (user.username === data.username) {
          this.liveUsers[index].count += 1;
        }
      }
    });
  }
  addTyping(data) {
    if (this.username !== data.username) {
      this.usertyping = true;
      setTimeout(() => {
        this.usertyping = false;
      }, 4000);
    }
    this.liveUsers.map((user, index) => {
      if (user.room === data.room) {
        if (user.username === data.username) {
          this.liveUsers[index].typing = true;
          setTimeout(() => {
            this.liveUsers[index].typing = false;
          }, 4000);
        }
      }
    });
  }
  /* join() {
    this.chatService.joinRoom();
  } */
  joinUser(user: any) {
    this.liveUsers.map((ele, index) => {
      if (ele.room === user.room) {
        if (ele.username === user.username) {
          this.liveUsers[index].count = 0;
        }
      }
    });
    if (this.joinUser !== user.room) {
      this.joinedUser = user.room;
      this.chatService.joinUserRoom(user.room, this.liveUsers);
    }
  }
  typingMsg($event, user: any = {}) {
    if (this.admindisplay) {
      const msg = $event.target.value;
      if (msg.length > 0) {
        this.chatService.typingMsg(this.joinedUser);
      }
    } else {
      const data = {
        username: this.username,
        room: this.userRoom,
        created_at: new Date(),
      };
      this.chatService.typingMsg(data.room);
    }
  }
  leave() {
    this.display = false;
    const data = {
      username: this.username,
      room: this.userRoom,
      created_at: new Date(),
    };
    this.chatService.leaveRoom(data);
  }
  leaveUser() {
    const data = {
      username: this.username,
      room: this.joinedUser,
      created_at: new Date(),
    };
    this.liveUsers.map((user, index) => {
      if (user.room === data.room) {
        this.liveUsers.splice(index, 1);
      }
    });
    this.chatService.leaveRoom(data);
  }
  userFocus() {
    this.usercount = 0;
    this.chatService.applySeen();
    this.messageArray.map((ele, index) => {
      this.messageArray[index].status = "seen";
    });
  }
  sendMessage() {
    this.usercount = 0;
    const data = {
      username: this.username,
      room: this.userRoom,
      created_at: new Date(),
      message: this.message,
    };
    if (this.message !== "") {
      this.chatService.sendMessage(data);
      this.message = "";
    }
  }
  adminSendMessage() {
    let msg = "";
    this.liveUsers.map((ele, index) => {
      if (ele.room === this.joinedUser) {
        msg = ele.msg;
        ele.msg = "";
      }
    });

    const data = {
      username: this.username,
      room: this.joinedUser,
      created_at: new Date(),
      message: msg,
    };

    if (msg !== "") {
      this.chatService.sendMessage(data);
    }
  }

  keySend($event, user = {}) {
    // if the letter is not digit then display error and don't type anything
    this.typingMsg($event, user);
    const keysValue = [13];
    // console.log($event.which, keysValue.indexOf($event.which));
    if (keysValue.indexOf($event.which) > -1) {
      if (this.userRoom === this.adminRoom) {
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
    this.liveUsers.map((ele) => {
      if (ele.room === user.room) {
        ele.minimize = !ele.minimize;
        if (!ele.minimize && this.joinedUser !== user.room) {
          this.joinUser(user);
        }
      }
    });
  }
}
