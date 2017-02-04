import { APIProvider } from '../../providers/APIProvider';
import { ToastController } from 'ionic-angular/components/toast/toast';
import { TootForm } from '../../apiClasses/tootForm';
import { Toot } from '../../apiClasses/toot';
import { TootPage } from '../toot/toot';
import { Component } from '@angular/core';
import { Keyboard } from 'ionic-native';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the ReplyToot page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-reply-toot',
  templateUrl: 'reply-toot.html',
  providers: [ APIProvider ]
})
export class ReplyTootPage {

  replyingToot: Toot;
  newToot: TootForm;
  
  constructor(
    public viewCtrl: ViewController,
    params: NavParams
  ) {
    this.replyingToot = params.get('replyingToot');
    this.newToot = new TootForm();
    this.newToot.in_reply_to_id = this.replyingToot.id;
    this.newToot.status = "@"+this.replyingToot.account.username;
    Keyboard.disableScroll(true);
  }

  dismiss(){
      this.viewCtrl.dismiss();
  }


}
