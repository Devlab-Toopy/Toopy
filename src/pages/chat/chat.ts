import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from "@angular/fire/database";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})
export class ChatPage {

    username: string = '';
    message: string = '';
    subscriptionMessage;

    constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase,) {
        this.username = this.navParams.get('username');
        // this.subscriptionMessage = this.db.object('/chats').subscribe
    }

    ionViewDidLoad() {
        this.db.list('/chats').push({
            username: this.username,
            message: this.message
        });
    }

    sendMessage(){
        this.db.list('/chats').push({
            username: this.username,
            message: this.message
        }).then( () => {
            // message is sent
        });
    }

}