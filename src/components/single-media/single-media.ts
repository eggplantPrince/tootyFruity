import { Component } from '@angular/core';

/*
  Generated class for the SingleMedia component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'single-media',
  templateUrl: 'single-media.html'
})
export class SingleMediaComponent {

  text: string;

  constructor() {
    console.log('Hello SingleMedia Component');
    this.text = 'Hello World';
  }

}
