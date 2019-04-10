import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase} from "@angular/fire/database";
import {ChannelManagerProvider} from "../../providers/channel-manager/channel-manager";
import {Subscription} from "rxjs/Rx";
import {Profile} from "../../models/profile";
import {Favorite} from "../../models/favorite";

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
  @ViewChild(Content) content: Content;

  users : Array<object>;
  username: string = '';
  message: string = '';
  messages: object[] = [];
  currentUser = {} as Profile;
  otherUser = {} as Favorite;
  chatId: string;
  subscriptionMessage : Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, private channelManager: ChannelManagerProvider,
) {
    this.currentUser = this.channelManager.currentUserProfile;
    this.username = this.currentUser.username;
    this.otherUser = this.navParams.get("selectedUser");
    this.chatId =  this.otherUser.chat;
    this.subscriptionMessage = this.db.list(`PrivateChats/${this.chatId}/chats`).valueChanges().subscribe(data => {
      this.messages = data;
      // this.content.scrollToBottom(100);
    });
  }

  ionViewDidLoad() {
  }

  sendMessage(){
    this.db.list(`PrivateChats/${this.chatId}/chats`).push({
      username: this.username,
      message: this.message
    }).then( () => {
      this.content.scrollToBottom(100);
    });
    this.message = '';
  }
}
