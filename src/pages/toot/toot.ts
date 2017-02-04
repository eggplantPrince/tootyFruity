import { Component } from '@angular/core';
import { TootForm } from '../../apiClasses/tootForm'
import { Keyboard } from 'ionic-native';

@Component({
  selector: 'page-toot',
  templateUrl: 'toot.html'
})

export class TootPage {

  newToot: TootForm;

  constructor() {
    Keyboard.disableScroll(true);
    this.newToot = new TootForm();
  }
  
}
