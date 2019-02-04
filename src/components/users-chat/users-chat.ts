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
  constructor(private channelManager: ChannelManagerProvider) {
    this.ChannelUsersSubscription = this.channelManager.channelUsersSubject.subscribe(data => {
      this.users = data;
      console.log(this.users);
    })
  }

  onPick(event:any){
   this.click = true;
    Observable.interval(100).map((x) => {

    }).takeWhile(() => { return this.click == true; }).subscribe(
      (x) => {
        console.log(event.clientY)
      },
      () => {},
      () => {});
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
}
