<<<<<<< HEAD
import { Mention } from '../../apiClasses/mention';
import { Account } from '../../apiClasses/account';
=======
>>>>>>> e624713b064e0bb5047ff39f61ab39c1dd6d2025
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
  hasSpoilerText: boolean = false;
  
  constructor(
    public viewCtrl: ViewController,
    params: NavParams
  ) {
    this.replyingToot = params.get('replyingToot');
    this.newToot = new TootForm();
    this.newToot.in_reply_to_id = this.replyingToot.id;
    this.newToot.status = this.getMentionsForStatus();
    if(this.replyingToot.spoiler_text) {
      this.newToot.spoiler_text = this.replyingToot.spoiler_text;
      this.hasSpoilerText = true;
    }
    this.newToot.visibility = this.replyingToot.visibility;
    Keyboard.disableScroll(true);
  }

  dismiss(){
      this.viewCtrl.dismiss();
  }

  getMentionsForStatus() : string {
    status = "";
    let authedUser: Account = JSON.parse(localStorage.getItem('user'));
    if(this.replyingToot.account.acct != authedUser.acct) {
      status = "@" + this.replyingToot.account.acct + " ";
    }
    for(let mention of this.replyingToot.mentions) {
      if(mention.acct != authedUser.acct) {
        status += "@" + mention.acct + " ";
      }
    }
    return status;
  }

}
