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
import {Subscription} from "rxjs/Rx";
import {ChannelManagerProvider} from "../providers/channel-manager/channel-manager";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';
  currentUser: any;
  username: string;
  theme : string;
  currentUserSubscription: Subscription;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private afAuth: AngularFireAuth, private channelManager: ChannelManagerProvider) {
    this.initializeApp();

    this.currentUserSubscription = this.channelManager.currentUserSubject.subscribe( currentUser => {
      this.username = currentUser['username'];
      this.theme = currentUser['theme'];
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Chat', component: ChatPage },
      { title: 'Favoris', component: FavoritesPage },
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
}
