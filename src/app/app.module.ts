import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { IonicSwipeAllModule } from 'ionic-swipe-all';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ChatPage } from "../pages/chat/chat";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule} from "@angular/fire/database";
import { AngularFireAuthModule} from '@angular/fire/auth';
import { IonicStorageModule } from '@ionic/storage';

import { environment } from "../../.localenv";
import { ChannelManagerProvider } from '../providers/channel-manager/channel-manager';

import {TimerComponent} from "../components/timer/timer";
import {UsersChatComponent} from "../components/users-chat/users-chat";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {LoginPage} from "../pages/login/login";

import {FavoritesPage} from "../pages/favorites/favorites";
import { PrivateChatProvider } from '../providers/private-chat/private-chat';
import {PrivateChatPage} from "../pages/private-chat/private-chat";
import {PrivateChatPageModule} from "../pages/private-chat/private-chat.module";

let config = environment.config;

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ChatPage,
    FavoritesPage,
    TimerComponent,
    UsersChatComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    IonicSwipeAllModule,
    PrivateChatPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ChatPage,
    FavoritesPage,
    PrivateChatPage
  ],
  providers: [
    IonicStorageModule,
    StatusBar,
    SplashScreen,
    ChannelManagerProvider,
    PrivateChatProvider,
  ]
})
export class AppModule {}
