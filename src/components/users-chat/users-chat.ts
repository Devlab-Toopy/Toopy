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
import {Profile} from "../../models/profile";
import {FavoritesManagerProvider} from "../../providers/favorites-manager/favorites-manager";
/**
 * Generated class for the UsersChatComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
interface newFavorite {
  uid: string,
  username: string,
  photoUrl: string,
}

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
  favoriteRequestsSubscription: Subscription;
  users : Array<Profile> = [];
  text: string;
  calculatedTop: number=-320;
  click: boolean = false;
  isOpen:boolean = false;
  state: string = 'closed';
  userFocus: boolean = false;
  selectedUser = {} as Profile;
  favorite: boolean = false;
  currentUser = {} as Profile;
  favoriteRequests: Array<newFavorite> = [];
  favoriteRequestsUid: Array<string> =[];
  favoriteRequest: boolean = false;
  constructor(private channelManager: ChannelManagerProvider,
              public db: AngularFireDatabase,
              public alertCtrl: AlertController,
              private favoriteManager: FavoritesManagerProvider) {
    this.ChannelUsersSubscription = this.channelManager.channelUsersSubject.subscribe(data => {
      this.users = this.channelManager.channelUsers;
      this.currentUser = this.channelManager.currentUserProfile;
      this.favoriteManager.getFavoriteRequests(this.currentUser);
    });
    this.favoriteRequestsSubscription = this.favoriteManager.favoriteRequestsSubject.subscribe( (data: Array<newFavorite>) => {
      this.favoriteRequests = data;
      for (let request of this.favoriteRequests) {
        this.favoriteRequestsUid.push(request.uid);
      }
    })
  }

  onAddFavorite(user: Profile){
      this.favoriteManager.askToAddFavorite(user, this.currentUser);
      this.popUp(`Une demande à été envoyé à ${user.username}, vous pourrez discutez lorsqu'il acceptera votre invitation ! `);
      this.selectedUser = user;
  }

  onRemoveFavorite(user: Profile){
    this.favoriteManager.deleteFavorite(user, this.currentUser);
    this.favorite = false;
    this.popUp(`L'utilisateur ${user['username']} a bien été enlevé des favoris ! `);
    this.selectedUser = user;
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

  focusUser(user: Profile){
    this.userFocus = true;
    this.selectedUser = user;
    console.log(this.selectedUser);
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

  acceptFavorite(user: Profile) {
    const confirm = this.alertCtrl.create({
      title: 'Ajout de favoris',
      message: `Vous allez ajouter ${user.username} en favoris. Vous pourrez discuter avec cette personne dans la partie Favoris`,
      buttons: [
        {
          text: 'Decliner',
          handler: () => {
          }
        },
        {
          text: 'Valider',
          handler: () => {
            this.favoriteManager.addFavorite(user, this.currentUser);
          }
        }
      ]
    });
    confirm.present();    // this.favoriteManager.addFavorite()
  }
}
