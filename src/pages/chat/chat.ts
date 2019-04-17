import { Component, ViewChild, ElementRef } from '@angular/core';
import {IonicPage, NavController, NavParams, Content, ToastController, MenuController} from 'ionic-angular';
import {AngularFireDatabase} from "@angular/fire/database";
import {ChannelManagerProvider} from "../../providers/channel-manager/channel-manager";
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import {UsersChatComponent} from "../../components/users-chat/users-chat";
import {delay} from "rxjs/internal/operators";
import {Subscription} from "rxjs/Rx";
import {Profile} from "../../models/profile";

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

  @ViewChild(Content) content: Content;
  username: string = '';
  message: string = '';
  user: object;

  currentUser = {} as Profile;
  date: any;
  subscriptionMessage : Subscription;
  messages: object[] = [];
  theme: string;
  channel: string;
  channelObject: any;

  constructor(public db: AngularFireDatabase,
              private channelManager: ChannelManagerProvider,
              private afAuth: AngularFireAuth,
              public menuCtrl: MenuController) {
    this.afAuth.authState.subscribe(data => {
        this.channelManager.getCurrentUser();
        this.subscriptionMessage = this.channelManager.currentUserSubject.subscribe((currentUser) => {
          this.currentUser = currentUser;
          this.username = currentUser.username;
          this.channelManager.getAllActiveChannels();
          this.channelManager.getThemes();
          this.theme = currentUser.theme;
          this.channelManager.theme = this.theme;
          this.channel = currentUser.channel;
          this.channelManager.getChannelUsers(this.channel);
          this.channelManager.channel = this.channel;
          this.channelManager.getInitDate(this.channel);
          this.subscriptionMessage = this.db.list(`Channels/${this.channel}/chats`).valueChanges().subscribe(data => {
            this.messages = data;
          });
          this.subscriptionMessage = this.db.list(`Channels/${this.channel}`).valueChanges().subscribe(data => {
            this.channelObject = data;
            this.channelManager.channelObject = this.channelObject;
          })
        });
    });
    this.menuCtrl.enable(true, 'myMenu');
  }

  ionViewDidLoad(){

  }

  swipeDown(event: any): any {
    console.log('Swipe All', event);
  }

  sendMessage(){
    this.db.list(`Channels/${this.channel}/chats`).push({
      username: this.username,
      message: this.message
    }).then( () => {
      this.content.scrollToBottom(100);
    });
    this.message = '';
  }

}
