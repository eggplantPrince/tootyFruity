import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Options page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-personal-options',
  templateUrl: 'personal-options.html'
})
export class PersonalOptionsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad OptionsPage');
  }


  deleteCache(){
    localStorage.setItem('notificationRefreshNeeded', 'true');
    localStorage.setItem('homeRefreshNeeded', 'true');
    this.navCtrl.pop();
  }
}
