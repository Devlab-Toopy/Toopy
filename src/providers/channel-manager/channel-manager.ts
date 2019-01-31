import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Subject} from "rxjs/Rx";
import { map } from 'rxjs/operators';

/*
  Generated class for the ChannelManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChannelManagerProvider {


  public dateSubject: Subject<object> = new Subject<object>();
  public themeSubject: Subject<object> = new Subject<object>();
  public channelUsersSubject: Subject<object> = new Subject<object>();
  public allChannelSubject: Subject<object> = new Subject<object>();
  public channelUsers: object;
  public channelObject: object;
  date: object;
  subscriptionMessage;
  public channel: string;
  public timer: number;
  public themes: object;
  public theme: string;
  public channels: object;
  public currentUser: object;

  constructor(public db: AngularFireDatabase) {
    console.log('Hello ChannelManagerProvider Provider');

  }

  public emitInitDateSubject(date){
    console.log('date '+date);
    this.dateSubject.next(date);
  }

  public emitThemeSubject(themes: object){
    this.themeSubject.next(themes);
  }

  public emitChannelUsersSubject(users: object){
    this.channelUsersSubject.next(users);
  }

  public emitAllChannelSubject(channels: object){
    this.allChannelSubject.next(channels)
  }

  public getInitDate(channel: string){
    console.log('nb loop');
    this.subscriptionMessage = this.db.list(`Channels/active/${channel}/init`).valueChanges().subscribe(data => {
      this.date = data[0];
      this.emitInitDateSubject(this.date);
    });
  }

  public getThemes(){
    this.subscriptionMessage = this.db.list('Themes').valueChanges().subscribe(data => {
      this.themes = data;
      console.log(data);
      this.emitThemeSubject(this.themes);
    })
  }

  public getChannelUsers(channel: string){
    this.subscriptionMessage = this.db.list(`Channels/active/${channel}/users`).valueChanges().subscribe(data => {
      this.channelUsers = data;
      this.emitChannelUsersSubject(this.channelUsers);
    })
  }

  public moveChannelToPast(){
    let channel = {
      [this.channel] : {
        'chats' : this.channelObject[0],
        'init': {
          'date' : this.channelObject[1]['date']
        },
        'theme' : this.channelObject[2],
        'users' : this.channelObject[3]
    }};
    this.db.object(`/Channels`).update({past : channel});
    this.db.object(`Channels/active/${this.channel}/`).remove();
  }

  public getAllActiveChannels(){
    this.subscriptionMessage = this.db.object('Channels/active').snapshotChanges().map(action => {
        const $key = action.payload.key;
        const data = { $key, ...action.payload.val() };
        return data;
      }).subscribe(channels => {
        this.emitAllChannelSubject(channels);
    })
  }

  public joinChannel(name: string, user:object){
    this.db.object(`/profile/${user['uid']}`).update({channel: name});
  }

  public createChannel(theme: string, user:object){
    let date =  new Date();
    let day = (date.getDate()).toString();
    let month = date.getMonth()+1;
    let thisMonth = '';
    if(month < 10){
      thisMonth = "0"+month.toString();
    }
    let year = (date.getFullYear()).toString();
    let time = date.getHours()+':'+date.getMinutes();
    let currentDate = year+'-'+thisMonth+'-'+day+'T'+time;
    let newChannelName = theme+year+thisMonth+day+'T'+time;
    let channel = {
      [newChannelName] : {
        'chats' : {},
        'init' : {
          'date' : currentDate
        },
        'theme' : theme,
        'users' : {[user['uid']]: user['uid']}
      }};
    this.db.object(`/profile/${user['uid']}`).update({active: newChannelName});
    this.db.object(`/Channels`).update({active: channel});
  }

}
