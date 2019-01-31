///<reference path="../../../node_modules/@angular/compiler/src/util.d.ts"/>
import { Component, OnInit } from '@angular/core';
import {ChannelManagerProvider} from "../../providers/channel-manager/channel-manager";
import {Subscription} from "rxjs/Rx";
import {Observable} from 'rxjs/Rx';
import { AlertController, NavController } from 'ionic-angular';
import {text} from "@angular/core/src/render3/instructions";
import * as firebase from 'firebase';
import {ChatPage} from "../../pages/chat/chat";
import {observableToBeFn} from "rxjs/internal/testing/TestScheduler";
import {AngularFireDatabase} from "@angular/fire/database";
import {noUndefined} from "@angular/compiler/src/util";

/**
 * Generated class for the TimerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'timer',
  templateUrl: 'timer.html'
})
export class TimerComponent {

  private themeSubscription: Subscription;
  private initDateSubscription: Subscription;
  private allChannelsSubscription: Subscription;
  public message: string;
  private endDate: Date;
  private futureString: string;
  private diff: number;
  public initDate: Date;
  public themes: object;
  public theme: string;
  public channels: object;
  public currentUser: object;

  constructor(private channelManager: ChannelManagerProvider, public alertCtrl: AlertController, public db: AngularFireDatabase) {
    this.initDateSubscription = this.channelManager.dateSubject.subscribe(
      (date: object) => {
        this.theme = this.channelManager.theme;
        if(date){
          this.initDate = new Date(date.toString());
          let myDate = this.initDate.setDate(this.initDate.getDate() + 7);
          this.endDate = new Date(myDate);
          Observable.interval(1000).map((x) => {
            this.diff = (this.endDate.getTime() - Date.now()) / 1000;
          }).takeWhile(() => { return this.diff >= 0; }).subscribe(
            (x) => {
              this.message = this.dhms(this.diff);
            },
            () => {},
            () => {
              this.showConfirm();
            });
        }
      }
    );
  }

  dhms(delta) {
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;

// calculate (and subtract) whole hours
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

// calculate (and subtract) whole minutes
    let mins = Math.floor(delta / 60) % 60;
    delta -= mins * 60;

// what's left is seconds
    let secs = Math.round(delta % 60);

    return [
      days + 'd',
      hours + 'h',
      mins + 'm',
      secs + 's'
    ].join(' ');
  }


  ngOnInit() {

  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Changer de theme',
      message: 'La conversation vous a plu ?? Vous voulez peut être changer de thème de discussion ?',
      buttons: [
        {
          text: 'Nope',
          handler: () => {
            this.channelManager.getAllActiveChannels();
            this.allChannelsSubscription = this.channelManager.allChannelSubject.subscribe(
              (channels: object) => {
                this.currentUser = firebase.auth().currentUser;
                let newchannel = true;
                  this.channels = channels;
                  let keys = Object.keys(this.channels);
                  for(let i = 0; i< keys.length; i++){
                    let channel = this.channels[keys[i]];
                    if(channel['theme'] == this.theme){
                      let initdate = new Date(channel['init']['date'].toString());
                      let delta = (Date.now() - initdate.getTime())/86400000;
                      if(delta > 4){
                        this.channelManager.moveChannelToPast();
                        this.channelManager.joinChannel(keys[i], this.currentUser);
                        newchannel = false;
                        break;
                      }
                   }
                }
                if(newchannel){
                    this.channelManager.createChannel(this.theme, this.currentUser);
                }
              }
            );
          }
        },
        {
          text: 'Chaud',
          handler: () => {
            console.log('Agree clicked');
            this.channelManager.getThemes();
            this.themeSubscription = this.channelManager.themeSubject.subscribe(
              (themes: object) => {
                this.themes = themes;
                this.showRadio();
              }
            );
          }
        }
      ]
    });
    confirm.present();
  }

  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Nouveau theme');

    for(let theme in this.themes){
      alert.addInput({
        type: 'radio',
        label: this.themes[theme],
        value:  this.themes[theme]
      });
    }


    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {

      }
    });
    alert.present();
  }
}
