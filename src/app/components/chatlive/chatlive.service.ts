import { Injectable, InjectionToken, Inject } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

export const ChatliveServiceConfig = new InjectionToken<any>('token for chat code');

@Injectable({
  providedIn: 'root',
})
export class ChatliveService {
  private socket: any;
  private username: string;
  private user_room: any;
  public options : any = {
    url: 'http://localhost:3000',
    admin_room: 1,
    room: 'default',
    username: 'admin',
  };
  constructor(@Inject(ChatliveServiceConfig) private config) {
    this.options = config;
    console.log(config, 'service');
    this.username = localStorage.getItem('username');
    this.user_room = localStorage.getItem('user_room');
  }

  openConnection() {
    //console.log(ChatConfig,'service');
    this.socket = io(this.options.url);
    let data = {
      username: this.username,
      room: this.user_room,
      created_at: new Date(),
    };
    if (this.user_room != 1) {
      /* other users only */
      this.joinRoom(data);
    } else {
      data.room = this.options.room;
      this.socket.emit('join', data);
    }

  }
  joinRoom(data) {
    const joined = localStorage.getItem('joined');
    if (joined == undefined || joined != 'yes') {
      this.socket.emit('invite', data);
      localStorage.setItem('joined', 'yes');
      this.socket.emit('join', data);
    } else {
      this.socket.emit('join', data);
    }

  }
  joinUserRoom(room, users) {
    const data = { username: this.username, room: room, created_at: new Date(), users: users };
    this.socket.emit('join', data);
    this.socket.emit('wait', data);
  }
  typingMsg(room) {
    const data = { username: this.username, room: room, created_at: new Date() };
    this.socket.emit('typing', data);
  }

  newUserJoined() {
    let observable = new Observable<{ user: String, room: String, message: string, created_at: Date }>(observer => {
      this.socket.on('new user joined', data => {
        // console.log(data);
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });
    return observable;
  }
  newTyping() {
    let observable = new Observable<{ user: String, room: String, created_at: Date }>(observer => {
      this.socket.on('new typing', data => {
        // console.log(data);
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });
    return observable;
  }

  leaveRoom(data) {
    if (this.user_room != 1) {
      localStorage.setItem('joined', 'no');
    }
    this.socket.emit('leave', data);
  }

  userLeftRoom() {
    let observable = new Observable<{ user: String, room: String, message: string, created_at: Date }>(observer => {
      this.socket.on('left room', data => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });
    return observable;
  }

  sendMessage(data) {
    this.socket.emit('message', data);
  }

  newMessageRecevied() {
    let observable = new Observable<{ user: String, room: String, message: String, created_at: Date }>(observer => {
      this.socket.on('new message', data => {
        // console.log(data, 'message received');
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });
    return observable;
  }
  newUser() {
    let observable = new Observable<{ user: String, room: String, message: String, created_at: Date, count: Number }>(observer => {
      this.socket.on('new_user', data => {
        //console.log(data);
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });
    return observable;
  }
}
