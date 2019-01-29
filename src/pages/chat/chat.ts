import { Component, ViewChild } from '@angular/core';
import {IonicPage, NavController, NavParams, Content, ToastController, MenuController} from 'ionic-angular';
import {AngularFireDatabase} from "@angular/fire/database";
import {ChannelManagerProvider} from "../../providers/channel-manager/channel-manager";
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';

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

  currentUser: any;

  date: any;
  subscriptionMessage;
  messages: object[] = [];
  theme: string;
  channel: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public db: AngularFireDatabase,
              private channelManager: ChannelManagerProvider,
              private afAuth: AngularFireAuth,
              private toast: ToastController,
              public menuCtrl: MenuController) {
    this.afAuth.authState.subscribe(data => {
      if(data.email){
        this.currentUser = firebase.auth().currentUser;
        console.log(this.currentUser);
        this.username = this.currentUser.displayName;

        this.toast.create({
          message: 'WELCOME',
          duration: 3000
        }).present();
        this.subscriptionMessage = this.db.list(`profile/${this.currentUser.uid}`).valueChanges().subscribe(data => {
          let channel = data[0];
          let theme = data[1];
          this.theme = theme.toString();
          this.channel = channel.toString();

          this.channelManager.getInitDate(this.channel);

          this.subscriptionMessage = this.db.list(`Channels/${this.channel}/chats`).valueChanges().subscribe(data => {
            this.messages = data;
            // this.contentArea.scrollToBottom();
          })
        });
      }
      else{
        this.toast.create({
          message: 'Could not find authentification',
          duration: 3000
        }).present();
      }
    });



    // this.username = this.navParams.get('username');
    // this.user = this.navParams.get('user');
    this.menuCtrl.enable(true, 'myMenu');
  }


  ionViewDidLoad(){

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


  // this.subscriptionMessage = this.db.list('Californie/init').valueChanges().subscribe(data => {
  //   this.date = data;
  //   console.log(data[0]);
  // });

}
