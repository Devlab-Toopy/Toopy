import { Component, ViewChild } from '@angular/core';
import {IonicPage, NavController, NavParams, Content, ToastController} from 'ionic-angular';
import {AngularFireDatabase} from "@angular/fire/database";
import {ChannelManagerProvider} from "../../providers/channel-manager/channel-manager";
import {AngularFireAuth} from '@angular/fire/auth';

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
  user: object;

  date: any;
  subscriptionMessage;
  messages: object[] = [];
  theme: string= 'Californie';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public db: AngularFireDatabase,
              private channelManager: ChannelManagerProvider,
              private afAuth: AngularFireAuth,
              private toast: ToastController) {
    this.username = this.navParams.get('username');
    this.user = this.navParams.get('user');

    this.subscriptionMessage = this.db.list('Californie/init').valueChanges().subscribe(data => {
      this.date = data;
      console.log(data);
    });
    // this.channelManager.getTimer('Californie');

    this.subscriptionMessage = this.db.list(`/${this.theme}/chats`).valueChanges().subscribe(data => {
        this.messages = data;
      this.contentArea.scrollToBottom();
    })
  }

  ionViewDidLoad() {
    this.afAuth.authState.subscribe(data => {
      if(data.email && data.uid){


        this.toast.create({
          message: 'WELCOME',
          duration: 3000
        }).present();
      }

      else{
        this.toast.create({
          message: 'Could not find authentification',
          duration: 3000
        }).present();
      }

    });
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
