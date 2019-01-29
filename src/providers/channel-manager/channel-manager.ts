import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Subject} from "rxjs/Rx";

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
  public channelUsers: Object;

  date: Object;
  subscriptionMessage;
  public channel: string;
  public timer: number;
  public themes: Object;

  constructor(public db: AngularFireDatabase) {
    console.log('Hello ChannelManagerProvider Provider');

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

  public checkChannel(theme: string){

  }

  public createChannel(theme: string){

  }

  public getInitDate(theme: string){
    this.subscriptionMessage = this.db.list(`Channels/${theme}/init`).valueChanges().subscribe(data => {
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
    this.subscriptionMessage = this.db.list(`Channels/${channel}/users`).valueChanges().subscribe(data => {
      this.channelUsers = data;
      this.emitChannelUsersSubject(this.channelUsers);
    })
  }

}
