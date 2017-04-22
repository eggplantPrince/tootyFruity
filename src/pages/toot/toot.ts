import { NavParams, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { TootForm } from '../../apiClasses/tootForm'
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  selector: 'page-toot',
  templateUrl: 'toot.html'
})

export class TootPage {

  newToot: TootForm;
  isModal: boolean = false;

  constructor(private viewCtrl: ViewController, private navParams: NavParams, private keyboard: Keyboard) {
    keyboard.disableScroll(true);
    this.newToot = new TootForm();
    let status = navParams.get('tootStatus');
    if(status){
      this.isModal = true;
      this.newToot.status = status;
    }
  }

  dismiss(){
      this.viewCtrl.dismiss();
  }
}
