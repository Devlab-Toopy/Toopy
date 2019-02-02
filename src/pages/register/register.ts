import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {User} from '../../models/user';
import {AngularFireAuth} from '@angular/fire/auth';
import {HomePage} from "../home/home";
import {Profile} from "../../models/profile";
import {AngularFireDatabase} from "@angular/fire/database";
import {ChannelManagerProvider} from "../../providers/channel-manager/channel-manager";
import {Subscription} from "rxjs/Rx";
import {async} from "rxjs/internal/scheduler/async";
import * as firebase from 'firebase';
import {ChatPage} from "../chat/chat";
import {LoginPage} from "../login/login";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

    user = {} as User;
    currentUser: any;
    profile = {} as Profile;
    themeSubscription: Subscription;
    themes: object;
    username: string;

  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,
      public navCtrl: NavController, public navParams: NavParams, private channelManager: ChannelManagerProvider, public menuCtrl: MenuController) {
    this.menuCtrl.enable(false, 'myMenu');

  }

  ionViewDidLoad(){
  this.channelManager.getThemes();
  this.channelManager.getAllActiveChannels();
  this.themeSubscription = this.channelManager.themeSubject.subscribe(
    (themes: object) => {
      this.themes = themes;
    }
  );
}


  async register(user: User, profile: Profile) {
    try {
        const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
        this.currentUser = firebase.auth().currentUser;
        this.currentUser.updateProfile({
          displayName: this.username
        }).then(function() {
          this.navCtrl.setRoot(ChatPage);
        }).catch(function(error) {
          // An error happened.
        });
    }
    catch(e){
      console.error(e);
    }

  this.afAuth.authState.take(1).subscribe(auth =>{
      this.afDatabase.object(`profile/`).update({[auth.uid]: profile})
          .then(() => {
        console.log(profile.theme);
        console.log(auth);
            this.channelManager.changeChannel(profile.theme, auth, true);
            this.navCtrl.canGoBack();
          })
  })

  }

}
