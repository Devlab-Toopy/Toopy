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
import {Observable, Subscription} from "rxjs/Rx";
import * as firebase from 'firebase';
import {ChatPage} from "../chat/chat";
import {Camera, CameraOptions} from "@ionic-native/camera";
import { Platform } from 'ionic-angular';
import {ImagePicker} from "@ionic-native/image-picker";
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/storage";
import {finalize} from "rxjs/internal/operators";
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
  providers:[Camera, ImagePicker, AngularFireStorage],
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
    subscriptionMessage: Subscription;
    public myPhotosRef: any;
    public myPhoto: any;
    public myPhotoURL: any;
    public downloadURL: Observable<string>;
    public imageUrl: string;
    public uploadPercent: Observable<number>;
    public hadPP: boolean = false;
    public upload: boolean = false;
  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, public navCtrl: NavController,
              private channelManager: ChannelManagerProvider, public menuCtrl: MenuController,
              public toastCtrl: ToastController, public alertCtrl: AlertController, private camera:Camera, private platform: Platform,
              private imagePicker: ImagePicker, private storage: AngularFireStorage) {
    this.menuCtrl.enable(false, 'myMenu');
    this.myPhotosRef = firebase.storage().ref();
    this.profile.photoUrl = 'https://firebasestorage.googleapis.com/v0/b/toopy-c21e6.appspot.com/o/Photos%2Favatar-empty.jpeg?alt=media&token=9c1829af-5a1d-4519-a43f-99c0b46bbb3a';
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

  getImage(){
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      quality: 1,
      targetWidth: 200,
      targetHeight: 200,
      //destinationType: this.platform.is('ios') ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL,
      destinationType: this.camera.DestinationType.DATA_URL,
      allowEdit: true,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      this.upload = true;
      let ref = this.storage.ref('Photos/'+this.generateUUID()+'.jpg');
      const task = ref.putString(imageData, 'base64', {contentType: 'image/png'});
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = ref.getDownloadURL();
          this.downloadURL.subscribe(url => {
            this.imageUrl = url;
            console.log("test");
            console.log(this.imageUrl);
            this.profile.photoUrl = this.imageUrl;
            this.hadPP = true;
            this.upload = false;
          })
        })
      ).subscribe()
    }, (error) => {
      console.debug("Unable to obtain picture: " + error, "app");
      console.log(error[0]);
    });
  }

  private generateUUID(): any {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

async register(user: User, profile: Profile) {
  if (user.email, user.password, profile.theme, profile.username) {

    this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then((res) => {
      console.log('res dump : ');
      console.log(res['user']);
      let user = res['user'];
      let uid = res['user']['uid'];
        profile.uid = uid;
        this.db.object(`profile/`).update({[uid]: profile})
              .then(() => {
                this.channelManager.username = this.username;
                this.channelManager.changeChannel(profile.theme, profile, true);
                this.navCtrl.setRoot(LoginPage);
              })
          })
      .catch((err) => {
        //Do as you please here
        this.errorAlert(err);
      });

    //   this.afAuth.authState.take(1).subscribe(auth =>{
    //     console.log('auth dump : ');
    //     console.log(auth);
    //     // this.db.object(`profile/`).update({[auth.uid]: profile})
    //     //   .then(() => {
    //     //     // console.log(profile.theme);
    //     //     // this.channelManager.username = this.username;
    //     //     // this.channelManager.changeChannel(profile.theme, auth, true);
    //     //     // this.navCtrl.pop();
    //     //   })
    //   })
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
