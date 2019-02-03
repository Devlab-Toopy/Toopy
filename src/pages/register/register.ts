import {Component, NgZone} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams, LoadingController} from 'ionic-angular';
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
              public imgService: ImgHandlerProvider, public loadingCtrl: LoadingController, public zone: NgZone) {
    this.menuCtrl.enable(false, 'myMenu');

  }

  ionViewDidLoad(){
  this.channelManager.getThemes();
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
      this.afDatabase.list(`profile/${auth.uid}`).push(profile)
          .then(() => this.navCtrl.setRoot(HomePage))
  })

  }


updateimage(imageurl) {
    var promise = new Promise((resolve, reject) => {
        this.afAuth.auth.currentUser.updateProfile({
            displayName: this.afAuth.auth.currentUser.displayName,
            photoURL: imageurl
        }).then(() => {
            firebase.database().ref('/users/' + firebase.auth().currentUser.uid).update({
                displayName: this.afAuth.auth.currentUser.displayName,
                photoURL: imageurl,
                uid: firebase.auth().currentUser.uid
            }).then(() => {
                resolve({ success: true });
            }).catch((err) => {
                reject(err);
            })
        }).catch((err) => {
            reject(err);
        })
    })
    return promise;
}

chooseimage() {
    let loader = this.loadingCtrl.create({
        content: 'Veuillez attendre'
    })
    loader.present();
    this.imgService.uploadimage().then((uploadedurl: any) => {
        loader.dismiss();
        this.zone.run(() => {
            this.imgurl = uploadedurl;
            this.moveon = false;
        })
    })
}

// updateproceed() {
//     let loader = this.loadingCtrl.create({
//         content: 'Please wait'
//     })
//     loader.present();
//     this.userservice.updateimage(this.imgurl).then((res: any) => {
//         loader.dismiss();
//         if (res.success) {
//             this.navCtrl.setRoot('TabsPage');
//         }
//         else {
//             alert(res);
//         }
//     })
// }
//
// proceed() {
//     this.navCtrl.setRoot('TabsPage');
//
// }

}
