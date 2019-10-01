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
  private userRoom: any;
  public options: any = {
    url: 'http://localhost:3000',
    admin_room: 1,
    room: 'default',
    username: 'admin',
  };
  constructor(@Inject(ChatliveServiceConfig) private config) {
    this.options = config;
    console.log(config, 'service');
    this.username = localStorage.getItem('username');
    this.userRoom = parseInt(localStorage.getItem('userRoom'), 10);
  }

  openConnection() {
    // console.log(ChatConfig,'service');
    this.socket = io(this.options.url);
    const data = {
      username: this.username,
      room: this.userRoom,
      created_at: new Date(),
    };
    if (this.userRoom !== this.options.admin_room) {
      /* other users only */
      this.joinRoom(data);
    } else {
      data.room = this.options.room;
      this.socket.emit('join', data);
    }

  }
  joinRoom(data) {
    const joined = localStorage.getItem('joined');
    if (joined === undefined || joined !== 'yes') {
      this.socket.emit('invite', data);
      localStorage.setItem('joined', 'yes');
      this.socket.emit('join', data);
    } else {
      this.socket.emit('join', data);
    }

  }
  joinUserRoom(room, users) {
    // tslint:disable-next-line:object-literal-shorthand
    const data = { username: this.username, room: room, created_at: new Date(), users: users };
    this.socket.emit('join', data);
    this.socket.emit('wait', data);
  }
  typingMsg(room) {
    // tslint:disable-next-line:object-literal-shorthand
    const data = { username: this.username, room: room, created_at: new Date() };
    this.socket.emit('typing', data);
  }

  newUserJoined() {
    const observable = new Observable<{ user: string, room: string, message: string, created_at: Date }>(observer => {
      this.socket.on('new user joined', data => {
        // console.log(data);
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }
  newTyping() {
    const observable = new Observable<{ user: string, room: string, created_at: Date }>(observer => {
      this.socket.on('new typing', data => {
        // console.log(data);
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }

  leaveRoom(data) {
    if (this.userRoom !== this.options.admin_room) {
      localStorage.setItem('joined', 'no');
    }
    this.socket.emit('leave', data);
  }

  userLeftRoom() {
    const observable = new Observable<{ user: string, room: string, message: string, created_at: Date }>(observer => {
      this.socket.on('left room', data => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }

  sendMessage(data) {
    this.socket.emit('message', data);
  }
  applySeen() {
    const data = {
      username: this.username,
      room: this.userRoom
    };
    this.socket.emit('seen', data);
  }
  newMessageRecevied() {
    const observable = new Observable<{ user: string, room: string, message: string, created_at: Date, status: string }>(observer => {
      this.socket.on('new message', data => {
        console.log(data, 'message received');
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }
  newUser() {
    const observable = new Observable<{ user: string, room: string, message: string, created_at: Date, count: number }>(observer => {
      this.socket.on('new_user', data => {
        // console.log(data);
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }
}
