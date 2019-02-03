import {Component, NgZone} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
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
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

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
              public toastCtrl: ToastController) {
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
          displayName: this.username,
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e'
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
            this.navCtrl.pop();
          })
  })

  }

openGallery () {
    let cameraOptions = {
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.FILE_URI,
        quality: 100,
        targetWidth: 1000,
        targetHeight: 1000,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true
    }

    Camera.getPicture(cameraOptions)
        .then(file_uri => this.imageSrc = file_uri,
            err => console.log(err));
}

}
