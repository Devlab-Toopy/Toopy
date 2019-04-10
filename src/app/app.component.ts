import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage} from '../pages/login/login';
import { ListPage } from '../pages/list/list';
import { ChatPage } from "../pages/chat/chat";
import { FavoritesPage} from "../pages/favorites/favorites";
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import {Observable, Subscription} from "rxjs/Rx";
import {ChannelManagerProvider} from "../providers/channel-manager/channel-manager";
import {PrivateChatPage} from "../pages/private-chat/private-chat";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {AngularFireStorage} from "@angular/fire/storage";
import {finalize} from "rxjs/internal/operators";
import {AngularFireDatabase} from "@angular/fire/database";
import {Profile} from "../models/profile";
import {ParametersPage} from "../pages/parameters/parameters";

@Component({
  templateUrl: 'app.html',
  providers: [Camera, AngularFireStorage]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';
  currentUser = {} as Profile;
  username: string;
  theme : string;
  currentUserSubscription: Subscription;
  pages: Array<{title: string, component: any}>;
  upload: boolean = false;
  public downloadURL: Observable<string>;
  photoUrl: string;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private afAuth: AngularFireAuth, private channelManager: ChannelManagerProvider,
              private camera: Camera, private storage: AngularFireStorage, private db: AngularFireDatabase) {
    this.initializeApp();

    this.currentUserSubscription = this.channelManager.currentUserSubject.subscribe( currentUser => {
      this.currentUser.username = currentUser['username'];
      this.currentUser.theme = currentUser['theme'];
      this.currentUser.photoUrl = currentUser['photoUrl'];
      this.currentUser.uid = currentUser['uid'];
    });


    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Chat', component: ChatPage },
      { title: 'Favoris', component: FavoritesPage },
      { title: 'Paramètres', component: ParametersPage},
    ];

    // this.afAuth.authState.subscribe(data => {
    //   if(data.email) {
    //     this.currentUser = firebase.auth().currentUser;
    //     this.username = this.currentUser.displayName;
    //   }
    // });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
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
            this.db.object(`profile/${this.currentUser.uid}/`).update({'photoUrl' : url});
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
}
