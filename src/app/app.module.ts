import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ChatPage } from "../pages/chat/chat";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule} from "@angular/fire/database";

let config = {
  apiKey: "AIzaSyAScAkxwNqVqj1a3WW-t946I9JIeNqrYU8",
  authDomain: "toopy-c21e6.firebaseapp.com",
  databaseURL: "https://toopy-c21e6.firebaseio.com",
  projectId: "toopy-c21e6",
  storageBucket: "toopy-c21e6.appspot.com",
  messagingSenderId: "702733067170"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ChatPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ChatPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
