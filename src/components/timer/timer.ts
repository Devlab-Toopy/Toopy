import { Component, OnInit } from '@angular/core';
import {ChannelManagerProvider} from "../../providers/channel-manager/channel-manager";
import {Subscription} from "rxjs/Rx";
import {Observable} from 'rxjs/Rx';

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

  private timerChange: Subscription;
  message: string;
  private EndDate: Date = new Date('2019-01-11T17:17:00');
  private futureString: string;
  private diff: any;
  initDate: Date = new Date('2019-01-04T17:17:00');

  constructor(private channelManager: ChannelManagerProvider) {

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
    Observable.interval(1000).map((x) => {

      this.diff = Math.abs(Date.now() - this.EndDate.getTime()) / 1000;
    }).subscribe((x) => {

      this.message = this.dhms(this.diff);
    });


  }
}
