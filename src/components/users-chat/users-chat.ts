import { Component } from '@angular/core';
import { Observable } from "rxjs/Rx";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
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

      state('open', style({
        'top': '{{calculatedTop}}px'
      }), {params: {calculatedTop: -355}}),
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
  users : Array<object> = [{'name' : 'Alexandre'}, {'name': 'Luc'}, {'name': 'Mathieu'}, {'name': 'Nico'}, {'name': 'Naïm'}, {'name': 'lautre pd'}];
  text: string;
  calculatedTop: number=-355;
  click: boolean = false;
  isOpen:boolean = false;

  constructor() {
    this.text = 'Hello World';
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

  onLeave(){
      this.click = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
