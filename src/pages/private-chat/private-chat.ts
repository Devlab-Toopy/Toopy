import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase} from "@angular/fire/database";

/**
 * Generated class for the PrivateChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-private-chat',
  templateUrl: 'private-chat.html',
})
export class PrivateChatPage {
  users : Array<object>;
  @ViewChild(Content) content: Content;
  username: string = '';
  message: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase) {
    this.users = this.navParams.get("users");
    console.log(this.users);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivateChatPage');
  }

  sendMessage(){
    this.db.list(`Channels/chats`).push({
      username: this.username,
      message: this.message
    }).then( () => {
      this.content.scrollToBottom(100);
    });
    this.message = '';
  }

}
