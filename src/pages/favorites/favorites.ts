import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ChannelManagerProvider} from "../../providers/channel-manager/channel-manager";
import {AngularFireDatabase} from "@angular/fire/database";
import {PrivateChatPage} from "../private-chat/private-chat";
import {Profile} from "../../models/profile";
import {Favorite} from "../../models/favorite";

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
  currentUser = {} as Profile;
  favorites: Array<Favorite> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private channelManager: ChannelManagerProvider, public db: AngularFireDatabase) {
    let usersObject = this.channelManager.currentUserProfile.favorites;
    this.currentUser = this.channelManager.currentUserProfile;

    for(let user in usersObject){
      let this_fav: Favorite = usersObject[user];
      this.favorites.push(this_fav);
      console.log(this_fav);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritesPage');
  }

  onSelectFav(selectedUser: Favorite) {
    this.navCtrl.push('PrivateChatPage', {selectedUser: selectedUser});
  }

}
