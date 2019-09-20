import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatliveService {
  private socket: any;
  private loggedUser: any;
  constructor() {
    this.loggedUser = JSON.parse(localStorage.getItem('user'));
  }

  openConnection() {
    this.socket = io('http://10.0.1.14:3000');
    let data = {
      username: this.loggedUser.username,
      room: this.loggedUser.user_id,
      created_at: new Date(),
    };
    if (this.loggedUser.user_id != 1) {
      /* other users only */
      this.joinRoom(data);
    } else {
      data.room = 'default';
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
    const data = { username: this.loggedUser.username, room: room, created_at: new Date(), users: users};
    this.socket.emit('join', data);
    this.socket.emit('wait', data);
  }
  typingMsg(room) {
    const data = { username: this.loggedUser.username, room: room, created_at: new Date()};
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
    if (this.loggedUser.user_id != 1) {
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
