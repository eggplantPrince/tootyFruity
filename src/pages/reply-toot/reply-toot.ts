import { Utility } from '../../providers/utility';
import { Account } from '../../apiClasses/account';
import { TootForm } from '../../apiClasses/tootForm';
import { Toot } from '../../apiClasses/toot';
import { Component } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
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
    public utility: Utility,
    public keyboard: Keyboard,
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
    this.keyboard.disableScroll(true);
  }

  dismiss(){
      this.viewCtrl.dismiss();
  }

  getMentionsForStatus() : string {
    status = "";
    let authedUser: Account = this.utility.getCurrentAccount().mastodonAccount;
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
