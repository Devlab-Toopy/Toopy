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
  private timerValuesSubscription: Subscription
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
  public days : string;
  public hours : string;
  public mins : string;
  public secs: string;
  public count : object;

  constructor(private channelManager: ChannelManagerProvider, public alertCtrl: AlertController, public db: AngularFireDatabase) {
    this.initDateSubscription = this.channelManager.dateSubject.subscribe(
      (date: object) => {
        this.channelManager.getTimer();
        this.timerValuesSubscription = this.channelManager.timerSubject.subscribe(data => {
          this.theme = this.channelManager.theme;
          if(date){
            this.initDate = new Date(date.toString());
            let myDate = this.initDate.setDate(this.initDate.getDate() + this.channelManager.timerCount);
            this.endDate = new Date(myDate);
            Observable.interval(1000).map((x) => {
              this.diff = (this.endDate.getTime() - Date.now()) / 1000;
            }).takeWhile(() => { return this.diff >= 0; }).subscribe(
              (x) => {
                this.dhms(this.diff);
              },
              () => {},
              () => {
                this.showConfirm();
              });
          }
        });
      }
    );
  }

  dhms(delta) {
    let days = Math.floor(delta / 86400);
    if(days < 10){
      this.days = '0'+days.toString()
    }else{
      this.days = days.toString()
    }
    delta -= days * 86400;

// calculate (and subtract) whole hours
    let hours = Math.floor(delta / 3600) % 24;
    if(hours < 10){
      this.hours = '0'+hours.toString()
    }else{
      this.hours = hours.toString()
    }
    delta -= hours * 3600;
// calculate (and subtract) whole minutes
    let mins = Math.floor(delta / 60) % 60;
    if(mins < 10){
      this.mins = '0'+mins.toString()
    }else{
      this.mins = mins.toString()
    }
    delta -= mins * 60;

// what's left is seconds
    let secs = Math.round(delta % 60);
    if(secs < 10){
      this.secs = '0'+secs.toString()
    }else{
      this.secs = secs.toString()
    }
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
                this.currentUser = this.channelManager.currentUserProfile;
                this.channelManager.changeChannel(this.theme, this.currentUser, false);
          }
        },
        {
          text: 'Chaud',
          handler: () => {
            console.log('Agree clicked');
                this.themes = this.channelManager.themes;
                this.showRadio();
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


    alert.addButton({
      text: 'Cancel',
      handler : data => {
        this.showConfirm();
      }
    });
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data);
        let choosenTheme = data;
        this.currentUser = this.channelManager.currentUserProfile;
        this.channelManager.changeChannel(choosenTheme, this.currentUser, false)
      }
    });
    alert.present();
  }
}
