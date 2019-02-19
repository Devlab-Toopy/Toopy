import { Component } from '@angular/core';
import {AlertController, IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {User} from "../../models/user";
import {AngularFireAuth} from '@angular/fire/auth';
import {ChatPage} from "../chat/chat";
import {HomePage} from "../home/home";
import { IonicStorageModule } from '@ionic/storage';
import {default as firebase, storage} from "firebase";
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  error: boolean;
  errorMessage: string;
  user = {} as User;
  currentUser: any;

  constructor(private afAuth: AngularFireAuth,
              public navCtrl: NavController, public navParams: NavParams,
              public menuCtrl: MenuController, public storage: IonicStorageModule,
              public alertCtrl: AlertController) {

      this.menuCtrl.enable(false, 'myMenu');
  }

  ionViewDidLoad(){
    this.currentUser = firebase.auth().currentUser;
    console.log(this.currentUser);

  }


  async login(user: User) {
      // storage.set('name', 'Max');
         this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
           .then((res) => {
           console.log("that's good");
               this.navCtrl.setRoot(ChatPage);
           })
           .catch((err)=> {
             //Do as you please here
             this.errorAlert(err);
           });
          // this.currentUser = firebase.auth().currentUser;
          // if(result){
          //   this.navCtrl.setRoot(ChatPage, {'email' : this.currentUser.email});
          // }
  }

  async errorAlert(error: string) {
    const alert = this.alertCtrl.create({
      title: 'Erreur',
      message: error,
      buttons: ['OK']
    });
    alert.present();
  }

  register() {
    this.navCtrl.push('RegisterPage');

  }

}
