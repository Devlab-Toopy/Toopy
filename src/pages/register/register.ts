import {Component, NgZone} from '@angular/core';
import {
  IonicPage, MenuController, NavController, NavParams, LoadingController, ToastController,
  AlertController
} from 'ionic-angular';
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
import {ImgHandlerProvider} from "../../providers/imghandler/imghandler";
import {LoginPage} from "../login/login";

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {Camera} from "@ionic-native/camera/ngx";

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

  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, public navCtrl: NavController,
              public navParams: NavParams, private channelManager: ChannelManagerProvider, public menuCtrl: MenuController,
              public imgService: ImgHandlerProvider, public zone: NgZone,
              public transfer: FileTransfer, public camera: Camera, public loadingCtrl: LoadingController,
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
            displayName: this.username,
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

openGallery () {
    let cameraOptions = {
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.FILE_URI,
        quality: 100,
        targetWidth: 1000,
        targetHeight: 1000,
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true
    };

    this.camera.getPicture(cameraOptions)
        .then(file_uri => this.imageURI = file_uri,
            err => console.log(err));
  }
}
