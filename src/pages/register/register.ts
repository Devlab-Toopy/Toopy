import {Component, NgZone} from '@angular/core';
import {
  IonicPage, MenuController, NavController, NavParams, LoadingController, ToastController,
  AlertController, normalizeURL
} from 'ionic-angular';
import {User} from '../../models/user';
import {AngularFireAuth} from '@angular/fire/auth';
import {Profile} from "../../models/profile";
import {AngularFireDatabase} from "@angular/fire/database";
import {ChannelManagerProvider} from "../../providers/channel-manager/channel-manager";
import {Subscription} from "rxjs/Rx";
import * as firebase from 'firebase';
import {ChatPage} from "../chat/chat";

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
    imageURI: any;
    imageFileName: any;
    imgurl = 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e';
    moveon: boolean = true;
    user = {} as User;
    currentUser: any;
    profile = {} as Profile;
    themeSubscription: Subscription;
    themes: object;
    username: string;

    myphoto: string;
  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, public navCtrl: NavController,
              private channelManager: ChannelManagerProvider, public menuCtrl: MenuController,
              public toastCtrl: ToastController, public alertCtrl: AlertController) {
    this.menuCtrl.enable(false, 'myMenu');

  }

  ionViewDidLoad(){
  this.channelManager.getThemes();
  this.channelManager.getAllActiveChannels();
  this.channelManager.getTimer();
  this.themeSubscription = this.channelManager.themeSubject.subscribe(
    (themes: object) => {
      this.themes = themes;
    }
  );
}


async register(user: User, profile: Profile) {
    if(user.email, user.password, profile.firstName, profile.lastName, profile.theme){

      this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          this.currentUser = firebase.auth().currentUser;
          this.currentUser.updateProfile({
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e'
          }).then(function() {

            this.navCtrl.setRoot(ChatPage);
          }).catch(function(error) {
            // An error happened.
          });
        })
        .catch((err)=> {
          //Do as you please here
          this.errorAlert(err);
        });

      this.afAuth.authState.take(1).subscribe(auth =>{
        this.afDatabase.object(`profile/`).update({[auth.uid]: profile})
          .then(() => {
            console.log(profile.theme);
            this.channelManager.username = this.username;
            this.channelManager.changeChannel(profile.theme, auth, true);
            this.navCtrl.pop();
          })
      })
    }else{
      this.errorAlert('Tous les champs sont à remplir ');
    }
}

  async errorAlert(error: string) {
    const alert = this.alertCtrl.create({
      title: 'Erreur',
      message: error,
      buttons: ['OK']
    });
    alert.present();
  }

}
