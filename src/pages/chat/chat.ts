import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import {AngularFireDatabase} from "@angular/fire/database";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) contentArea: Content;

  username: string = '';
  message: string = '';
  subscriptionMessage;
  messages: object[] = [];
  theme: string= 'Californie';

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase,) {
    this.username = this.navParams.get('username');
    this.subscriptionMessage = this.db.list(`/${this.theme}/chats`).valueChanges().subscribe(data => {
        this.messages = data;
      this.contentArea.scrollToBottom();
    })
  }

  ionViewDidLoad() {

  }

  sendMessage(){
      this.db.list(`/${this.theme}/chats`).push({
          username: this.username,
          message: this.message
      }).then( () => {
          // message is sent
      });
      this.message = '';
  }

}
