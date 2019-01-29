import { Component } from '@angular/core';
import { Observable } from "rxjs/Rx";

/**
 * Generated class for the UsersChatComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'users-chat',
  templateUrl: 'users-chat.html',
})
export class UsersChatComponent {
  users : Array<object> = [{'name' : 'Alexandre'}, {'name': 'Luc'}, {'name': 'Mathieu'}, {'name': 'Nico'}, {'name': 'Naïm'}, {'name': 'lautre pd'}];
  text: string;
  calculatedTop: number=120;
  click: boolean = false;
  constructor() {
    console.log('Hello UsersChatComponent Component');
    this.text = 'Hello World';
  }

  onPick(){
   this.click = true;
    Observable.interval(100).map((x) => {

    }).takeWhile(() => { return this.click == true; }).subscribe(
      (x) => {
        console.log('yo')
      },
      () => {},
      () => {});
  }

  onLeave(){
  this.click = false;
  }
}
