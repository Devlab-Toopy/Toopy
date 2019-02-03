import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ChatPage } from "../pages/chat/chat";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule} from "@angular/fire/database";
import { AngularFireAuthModule} from '@angular/fire/auth';
import { IonicStorageModule } from '@ionic/storage';

import { environment } from "../../.localenv";
import { ChannelManagerProvider } from '../providers/channel-manager/channel-manager';
import { ImgHandlerProvider } from "../providers/imghandler/imghandler";

import {TimerComponent} from "../components/timer/timer";
import {UsersChatComponent} from "../components/users-chat/users-chat";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {LoginPage} from "../pages/login/login";

let config = environment.config;


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ChatPage,
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
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ChatPage,
  ],
  providers: [
    IonicStorageModule,
    StatusBar,
    SplashScreen,
    File,
    FilePath,
    FileChooser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ChannelManagerProvider,
    ImgHandlerProvider,
  ]
})
export class AppModule {}
