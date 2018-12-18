import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {ChatPage} from "../chat/chat";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  username: string = '';

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {

  }

  showAlert(title: string, message: string) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  loginUser(){
    if(/^[a-zA-Z0-9]+$/.test(this.username)) {
      // all cool
      this.navCtrl.push(ChatPage, {
        username: this.username
      });
    } else {
      this.showAlert('ERROR', 'invalid username');
    }
  }

}
