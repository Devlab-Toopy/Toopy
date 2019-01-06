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


  public timerChangeSubject: Subject<any>;

  date: any;
  subscriptionMessage;
  public channel: string;
  public timer: number;

  constructor(public db: AngularFireDatabase) {
    console.log('Hello ChannelManagerProvider Provider');

  }

  public checkChannel(theme: string){

  }

  public createChannel(theme: string){

  }

  public getInitDate(theme: string){
    // this.subscriptionMessage = this.db.list('Californie/init').valueChanges().subscribe(data => {
    //   this.date = data[0];
    //   this.timerChangeSubject.next(this.date);
    // });
  }

}
