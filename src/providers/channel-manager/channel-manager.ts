import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Subject} from "rxjs/Rx";
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

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
  public currentUserSubject: Subject<object> = new Subject<object>();
  public timerSubject: Subject<object> = new Subject<object>();
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
  public currentUserProfile: object;
  public activeChannels: Array<object>;
  public timerCount: number;
  public timerMin: number;
  public username: string;

  constructor(public db: AngularFireDatabase) {
  }

  public emitInitDateSubject(date){
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

  public getCurrentUser(){
    this.currentUser = firebase.auth().currentUser;
    this.subscriptionMessage = this.db.object(`profile/${this.currentUser['uid']}`).snapshotChanges().map(action => {
      const uid = action.payload.key;
      const data = { uid, ...action.payload.val() };
      return data;
    }).subscribe(profile => {
      this.currentUserProfile = profile;
      console.log(this.currentUserProfile);
      this.currentUserSubject.next(this.currentUserProfile);
    })
  }


  public getInitDate(channel: string){
    this.subscriptionMessage = this.db.list(`Channels/${channel}/init`).valueChanges().subscribe(data => {
      this.date = data[0];
      this.emitInitDateSubject(this.date);
    });
  }

  public getThemes(){
    this.subscriptionMessage = this.db.list('Themes').valueChanges().subscribe(data => {
      this.themes = data;
      this.emitThemeSubject(data);
    })
  }

  public getTimer(){
    this.subscriptionMessage = this.db.object('Timer').snapshotChanges().map(action => {
      const $key = action.payload.key;
      const data = { $key, ...action.payload.val() };
      return data;
    }).subscribe(timer => {
      this.timerCount = timer['TimerCount'];
      console.log(this.timerCount);
      this.timerMin = timer['TimerMin'];
      this.timerSubject.next();
    })
  }

  public getChannelUsers(channel: string){
    this.subscriptionMessage = this.db.list(`Channels/${channel}/users`).snapshotChanges().subscribe(users => {
      let channelUsers = [];
      for(let user of users){
        console.log(user.payload.val());
        let uid = user['key'];
        this.db.object(`/profile/${uid}`).snapshotChanges().subscribe(profile => {
          let data = profile.payload.val();
          data = Object.assign(data, {'uid' : uid, 'username' : user.payload.val()});
          channelUsers.push(data);
        });
      }
      this.channelUsers = channelUsers;
      console.log(this.channelUsers);
      this.emitChannelUsersSubject(this.channelUsers);
    })
  }

  public moveChannelToPast() {
    if(this.channelObject){
      let channel = {
        [this.channel]: {
          'chats': this.channelObject[0],
          'init': {
            'date': this.channelObject[1]['date']
          },
          'theme': this.channelObject[2],
          'users': this.channelObject[3]
        }
      };
      this.db.object(`Channels/${this.channel}`).update({active : false});
    }

  }

  public getAllActiveChannels(){
    this.subscriptionMessage = this.db.list('Channels/', ref => ref.orderByChild('active').equalTo('true'))
      .snapshotChanges()
      .subscribe(channels => {
        let activeChannels = [];
      for(let channel of channels){
        let data = JSON.stringify(channel['payload']);
        data = JSON.parse(data);
        let activechannel = { 'key' : channel['key'], 'data' : data};
        activeChannels.push(activechannel);
      }
      this.activeChannels = activeChannels;
    })
  }

  public joinChannel(name: string, user:object, theme: string)
  {
    if(user['username']){
      this.db.object(`/Channels/${name}/users`).update({[user['uid']]: user['username']});
    }else{
      this.db.object(`/Channels/${name}/users`).update({[user['uid']]: this.username});
    }
    this.db.object(`/profile/${user['uid']}`).update({channel: name});
    this.db.object(`/profile/${user['uid']}`).update({theme: theme});
    console.log(user);
  }

  public createChannel(theme: string, user:object)
  {
    let date =  new Date();
    let day = date.getDate();
    let thisDay = '';
    if(day < 10){
      thisDay = "0"+day.toString();
    }else{
      thisDay = day.toString()
    }
    let month = date.getMonth()+1;
    let thisMonth = '';
    if(month < 10){
      thisMonth = "0"+month.toString();
    }else{
      thisMonth = month.toString();
    }
    let year = (date.getFullYear()).toString();

    let minute = date.getMinutes();
    let thisMinute = '';
    if(minute < 10){
      thisMinute = "0"+minute.toString()
    }else{
      thisMinute = minute.toString();
    }

    let hours = date.getHours();
    let thisHour = '';
    if(hours < 10){
      thisHour = "0"+hours.toString()
    }else{
      thisHour = hours.toString();
    }

    let second = date.getSeconds();
    let thisSeconds = '';
    if(second < 10){
      thisSeconds = "0"+second.toString()
    }else{
      thisSeconds = second.toString();
    }

    let currentDate = year+'-'+thisMonth+'-'+thisDay+'T'+thisHour+':'+thisMinute+':'+thisSeconds;

    let newChannelName = theme+year+thisMonth+thisDay+'T'+thisHour+thisMinute;
    let channel = {
        'chats' : {},
        'init' : {
          'date' : currentDate
        },
        'theme' : theme,
        'active' : 'true',
        'users' : {[user['uid']]: user['username']},
      };
    console.log(newChannelName);
    console.log(channel);
    this.db.object(`/profile/${user['uid']}`).update({channel: newChannelName});
    this.db.object(`/profile/${user['uid']}`).update({theme: theme});
    this.db.object(`/Channels`).update({[newChannelName]: channel});
    this.db.object(`/Channels/${newChannelName}/users`).update({[user['uid']]: user['username']});
  }

  changeChannel(theme: string, user: object, newUser: boolean){
    let newchannel = true;
    let keys = [];
    console.log(user);
    console.log(this.activeChannels);
    for(let channel of this.activeChannels)
    {
      if(channel['data']['theme'] == theme){
        let initdate = new Date(channel['data']['init']['date'].toString());
        let delta = (Date.now() - initdate.getTime())/86400000;
        if(delta < this.timerMin){
          if(!newUser){
            this.moveChannelToPast();
          }
          this.joinChannel(channel['key'], user, theme);
          newchannel = false;
          break;
        }
      }
    }
    if(newchannel){
      if(!newUser){
        this.moveChannelToPast();
      }
      this.createChannel(theme, user);
    }
  }

}
