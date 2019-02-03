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

getImage() {
    const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
        this.imageURI = imageData;
    }, (err) => {
        console.log(err);
        this.presentToast(err);
    });
}

uploadFile() {
let loader = this.loadingCtrl.create({
    content: "Uploading..."
});
loader.present();
const fileTransfer: FileTransferObject = this.transfer.create();

let options: FileUploadOptions = {
    fileKey: 'ionicfile',
    fileName: 'ionicfile',
    chunkedMode: false,
    mimeType: "image/jpeg",
    headers: {}
}

fileTransfer.upload(this.imageURI, 'http://192.168.0.7:8080/api/uploadImage', options)
    .then((data) => {
        console.log(data+" Uploaded Successfully");
        this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
        loader.dismiss();
        this.presentToast("Image uploaded successfully");
    }, (err) => {
        console.log(err);
        loader.dismiss();
        this.presentToast(err);
    });
}

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }

}
