import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {User} from "../../models/user";
import {AngularFireAuth} from '@angular/fire/auth';
import {ChatPage} from "../chat/chat";
import {HomePage} from "../home/home";
import { IonicStorageModule } from '@ionic/storage';
import {storage} from "firebase";
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

  user = {} as User;

  constructor(private afAuth: AngularFireAuth,
              public navCtrl: NavController, public navParams: NavParams,
              public menuCtrl: MenuController, public storage: IonicStorageModule) {

      this.menuCtrl.enable(false, 'myMenu');
  }

  async login(user: User) {
      // storage.set('name', 'Max');
      try {
          const result = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
          console.log(result);
          if(result){

            this.navCtrl.setRoot(ChatPage,{
                username: this.user.email,
              user : this.user
            })
          }
      }
      catch(e){
          console.error(e);
      }


  }

  register() {
    this.navCtrl.push('RegisterPage');

  }

}
