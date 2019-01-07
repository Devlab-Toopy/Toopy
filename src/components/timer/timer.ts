import { Component, OnInit } from '@angular/core';
import {ChannelManagerProvider} from "../../providers/channel-manager/channel-manager";
import {Subscription} from "rxjs/Rx";
import {Observable} from 'rxjs/Rx';
import { AlertController } from 'ionic-angular';

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

  private initDateSubscription: Subscription;
  message: string;
  private endDate: Date;
  private futureString: string;
  private diff: number;
  initDate: Date;

  constructor(private channelManager: ChannelManagerProvider, public alertCtrl: AlertController) {

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

    this.initDateSubscription = this.channelManager.dateSubject.subscribe(
      (date: object) => {
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
    );
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Use this lightsaber?',
      message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }
}
