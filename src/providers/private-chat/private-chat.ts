import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";

/*
  Generated class for the PrivateChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PrivateChatProvider {

  constructor(public db: AngularFireDatabase) {
  }

  public openChat(user1: object, user2: object) {
    console.log(user1);
    console.log(user2);
    let chatId = user1['uid']+user2['uid'];
    this.db.object('/PrivateChats').update({
      [chatId] : {
        'users': {
          [user1['uid']]: user1['username'],
          [user2['uid']]: user2['username']
        }
      }
    }).then(() => {
      this.db.object(`/profile/${user1['uid']}/favorites/${user2['uid']}`).update({
        "chat" : chatId
      });
      this.db.object(`/profile/${user2['uid']}/favorites/${user1['uid']}`).update({
        "chat" : chatId
      })
    });
  }

}

