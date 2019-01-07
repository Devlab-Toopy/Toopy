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
    profile = {} as Profile;
    themeSubscription: Subscription;
    themes: object;

  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,
      public navCtrl: NavController, public navParams: NavParams, private channelManager: ChannelManagerProvider, public menuCtrl: MenuController) {
    this.menuCtrl.enable(false, 'myMenu');

  }

  ionViewDidLoad(){
  this.channelManager.getThemes();

  this.themeSubscription = this.channelManager.themeSubject.subscribe(
    (themes: object) => {
      this.themes = themes;
    }
  );
}


  async register(user: User, profile: Profile) {
    try {
        const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
        console.log(result);
    }
    catch(e){
      console.error(e);
    }

  this.afAuth.authState.take(1).subscribe(auth =>{
      this.afDatabase.list(`profile/${auth.uid}`).push(profile)
          .then(() => this.navCtrl.setRoot(HomePage))
  })

  }

}
