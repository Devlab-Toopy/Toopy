import { Component } from '@angular/core';
import {Observable, Subscription} from "rxjs/Rx";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import {ChannelManagerProvider} from "../../providers/channel-manager/channel-manager";
import {AngularFireDatabase} from "@angular/fire/database";
import {AlertController} from "ionic-angular";
import {PrivateChatProvider} from "../../providers/private-chat/private-chat";
/**
 * Generated class for the UsersChatComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'users-chat',
  templateUrl: 'users-chat.html',
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        'top': '{{calculatedTop}}px'
      }), {params: {calculatedTop: 0}}),

      state('closed', style({
        'top': '{{calculatedTop}}px'
      }), {params: {calculatedTop: -320}}),
      transition('open => closed', [
        animate('0.5s ease-in-out'),
      ]),
      transition('closed => open', [
        animate('0.5s ease-in-out'),
      ]),
    ]),
  ]
})
export class UsersChatComponent {
  ChannelUsersSubscription: Subscription;
  users : object;
  text: string;
  calculatedTop: number=-320;
  click: boolean = false;
  isOpen:boolean = false;
  state: string = 'closed';
  userFocus: boolean = false;
  selectedUser: object;
  favorite: boolean = false;
  currentUser: object;

  constructor(private channelManager: ChannelManagerProvider, public db: AngularFireDatabase, public alertCtrl: AlertController, private PrivateChat: PrivateChatProvider) {
    this.ChannelUsersSubscription = this.channelManager.channelUsersSubject.subscribe(data => {
      this.users = data;
      this.selectedUser = {'username ' : 'user'};
      this.currentUser = this.channelManager.currentUserProfile;
    })
  }

  onAddFavorite(user){
    this.db.object(`/profile/${this.currentUser['uid']}/favorites`).update({[user['uid']] : user['username']}).then(() => {
      this.favorite = true;
      this.popUp(`L'utilisateur ${user['username']} a bien été ajouté aux favoris ! `);
      this.selectedUser = user;
      this.PrivateChat.openChat(this.currentUser, user);
    });
  }

  onRemoveFavorite(user){
    console.log(user);
    this.db.object(`/profile/${this.currentUser['uid']}/favorites/${user['uid']}`).remove().then(() => {
      this.favorite = false;
      this.popUp(`L'utilisateur ${user['username']} a bien été enlevé des favoris ! `);
      this.selectedUser = user;
    });
  }

  async popUp(message: string) {
    const alert = this.alertCtrl.create({
      title: 'Terminé',
      message: message,
      buttons: ['OK']
    });
    alert.present();
  }

  swipeDown(){
    console.log('swipedown');
    this.isOpen = true;
  }

  swipeUp(){
    this.isOpen = false;
  }

  onLeave(){
      this.click = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  focusUser(user){
    this.userFocus = true;
    this.selectedUser = user;
    let favorite = this.db.object(`profile/${this.currentUser['uid']}/favorites/${user['uid']}`).valueChanges().subscribe((data) =>{
      if(data){
        this.favorite = true;
      }else{
        this.favorite = false;
      }
    });
  }
  closeFocusUser(){
    this.userFocus = false;
  }
}
