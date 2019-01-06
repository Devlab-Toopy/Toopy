import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";

/*
  Generated class for the ChannelManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChannelManagerProvider {

  public channel: string;
  public timer: number;
  constructor(public db: AngularFireDatabase) {
    console.log('Hello ChannelManagerProvider Provider');
  }

  public checkChannel(theme: string){

  }

  public createChannel(theme: string){

  }

  public getTimer(theme: string){
    let init = this.db.list('Californie/init/date');
    console.log('yo : ');
    console.log(init);
  }

}
