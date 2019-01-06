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
  private actualDate: string;
  private futureString: string;
  private diff: any;
  initDate: Date = new Date('2019-01-04T17:17:00');

  constructor(private channelManager: ChannelManagerProvider) {

  }

  dhms(difference) {
    let days, hours, mins, secs;
    days = Math.floor(difference / (60 * 60 * 1000 * 24) * 1);
    hours = Math.floor((difference % (60 * 60 * 1000 * 24)) / (60 * 60 * 1000) * 1);
    mins = Math.floor(((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) / (60 * 1000) * 1);
    secs = Math.floor((((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000 * 1);

    return [
      days + 'd',
      hours + 'h',
      mins + 'm',
      secs + 's'
    ].join(' ');
  }


  ngOnInit() {
    Observable.interval(1000).map((x) => {
      this.diff = Math.floor((Date.now() - this.initDate.getTime()));
    }).subscribe((x) => {

      this.message = this.dhms(Date.now());
    });


  }
}
