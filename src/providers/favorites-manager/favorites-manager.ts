import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Profile} from "../../models/profile";
import {AngularFireDatabase} from "@angular/fire/database";
import {PrivateChatProvider} from "../private-chat/private-chat";
import {Favorite} from "../../models/favorite";
import {Subject} from "rxjs/Rx";

/*
  Generated class for the FavoritesManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

interface newFavorite {
  uid: string,
  username: string,
  photoUrl: string,
}
@Injectable()
export class FavoritesManagerProvider {
  public favoriteRequestsSubject: Subject<object> = new Subject<object>();

  public favoriteRequests: Array<newFavorite>;

  constructor(public db: AngularFireDatabase, private PrivateChat: PrivateChatProvider) {
    console.log('Hello FavoritesManagerProvider Provider');
  }

  public emitFavoriteRequestsSubject(favoriteRequests: Array<newFavorite>){
    this.favoriteRequestsSubject.next(favoriteRequests);
  }

  public addFavorite(user: Profile,  currentUser: Profile){
    this.db.object(`/profile/${currentUser.uid}/favorites`).update({[user.uid] : {"username" : user.username}}).then(() => {
      this.db.object(`/profile/${user.uid}/favorites`).update({[currentUser.uid] : {"username" : currentUser.username}});
      this.PrivateChat.openChat(currentUser, user);
      this.db.object(`profile/${currentUser.uid}/favoriteRequests/${user.uid}`).remove();
    });
  }

  public deleteFavorite(user: Profile, currentUser: Profile){
    this.db.object(`/profile/${currentUser.uid}/favorites/${user.uid}`).remove().then(() => {
      console.log("remove succesfully");
    });
  }

  public askToAddFavorite(user: Profile, currentUser: Profile){
    let newFavorite = {} as newFavorite;
    newFavorite.uid = currentUser.uid;
    newFavorite.username = currentUser.username;
    newFavorite.photoUrl = currentUser.photoUrl;
    this.db.object(`/profile/${user.uid}/favoriteRequests/`).update({[newFavorite.uid] : newFavorite})
  }

  public getFavoriteRequests(user: Profile){
    this.db.list(`/profile/${user.uid}/favoriteRequests`).valueChanges().subscribe((requests: Array<newFavorite>) => {
      this.favoriteRequests = requests;
      this.emitFavoriteRequestsSubject(this.favoriteRequests);
    })
  }
}
