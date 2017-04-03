import { TootForm } from '../../apiClasses/tootForm';
import { Toot } from '../../apiClasses/toot';
import { Component } from '@angular/core';
import { Keyboard } from 'ionic-native';
import { NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-reply-toot',
  templateUrl: 'reply-toot.html'
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
    this.newToot.status = "@"+this.replyingToot.account.acct;
    Keyboard.disableScroll(true);
  }

  dismiss(){
      this.viewCtrl.dismiss();
  }


}
