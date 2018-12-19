import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFireAuth} from '@angular/fire/auth';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

    constructor(private afAuth: AngularFireAuth, private toast: ToastController,
                public navCtrl: NavController, public navParams: NavParams) {
    }

  ionViewDidLoad(){
    this.afAuth.authState.subscribe(data => {
      if(data.email && data.uid){


      this.toast.create({
          message: 'WELCOME',
          duration: 3000
      }).present();
      }

      else{
          this.toast.create({
              message: 'Could not find authentification',
              duration: 3000
          }).present();
      }

    });
  }
}
