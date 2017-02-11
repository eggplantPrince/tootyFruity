import { Relationships } from '../../apiClasses/relationships';
import { APIProvider } from '../../providers/APIProvider';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the UserOptions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-options',
  templateUrl: 'user-options.html'
})
export class UserOptionsPage {

  user_id: string;
  isBlocked: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private mastodon: APIProvider) {
    this.isBlocked = this.navParams.get('isBlocked');
    this.user_id = this.navParams.get('user_id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserOptionsPage');
  }


blockUser(){
    this.mastodon.blockUser(this.user_id).map((res) =>{
      let tempRelationships: Relationships = JSON.parse(res['_body']);
      return tempRelationships;
    }) .subscribe((data) => {
      let relationship: Relationships = data;
      this.viewCtrl.dismiss(relationship)
    })
  }
unblockUser(){
    this.mastodon.unblockUser(this.user_id).map((res) =>{
      let tempRelationships: Relationships = JSON.parse(res['_body']);
      return tempRelationships;
    }) .subscribe((data) => {
      let relationship: Relationships = data;
      this.viewCtrl.dismiss(relationship)
    })
  }
}
