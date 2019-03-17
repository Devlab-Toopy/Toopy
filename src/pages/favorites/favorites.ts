import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ChannelManagerProvider} from "../../providers/channel-manager/channel-manager";
import {AngularFireDatabase} from "@angular/fire/database";
import {PrivateChatPage} from "../private-chat/private-chat";

/**
 * Generated class for the FavoritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {
  currentUser: object;
  favorites: Array<object> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private channelManager: ChannelManagerProvider, public db: AngularFireDatabase) {
    let usersObject = this.channelManager.currentUserProfile['favorites'];
    console.log(usersObject);
    this.currentUser = this.channelManager.currentUserProfile;
    for(let user in usersObject){
      this.favorites.push(usersObject[user]);
    }
    console.log(this.favorites);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritesPage');
  }

  onSelectFav(selectedUser) {
    this.navCtrl.push(PrivateChatPage, {
      users: [{
        'uid' : this.currentUser['uid'],
        'username' : this.currentUser['username']
      },
        {
          'uid' : selectedUser['uid'],
          'username' : selectedUser['username']
        }]
    });
  }

}
