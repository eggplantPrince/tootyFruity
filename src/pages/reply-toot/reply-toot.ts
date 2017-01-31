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
  spoilerFieldState: string = 'hidden';
  spoilerToggle: Boolean;
  remainingCharacters: number;
  
  constructor(
    public viewCtrl: ViewController,
    params: NavParams,
    public navCtrl: NavController,
    public toaster: ToastController,
    public mastodon: APIProvider
  ) {
    this.replyingToot = params.get('replyingToot');
    this.newToot = new TootForm();
    this.newToot.in_reply_to_id = this.replyingToot.id;
    this.newToot.status = "@"+this.replyingToot.account.username; 
    this.countTootLength();
    Keyboard.disableScroll(true);
  }

  sendToot() {
    if(this.newToot.status == null ){
      let toast = this.toaster.create({
        message: 'Your toot needs some fruit (aka content)!',
        duration: 3000,
        position: 'top'
      });
      toast.present();  
    } else {
      console.log('posting new toot...')
      if(!this.spoilerToggle){
        this.newToot.spoiler_text = null;
      }
      this.mastodon.postToot(this.newToot)
      .subscribe(
        data=> {
          let toast = this.toaster.create({
            message: '🍇🍌🍍TOOT SENT 🍊🍋🍒',
            duration: 2000,
            position: 'top',
            cssClass: 'success_toast'
          });
          this.newToot = new TootForm();
          toast.present();  
          this.viewCtrl.dismiss();
        },
        error => console.log(JSON.stringify(error))
      );
      localStorage.setItem('lastVisibility', this.newToot.visibility);

    }
  }

  dismiss(){
      this.viewCtrl.dismiss();
  }

  toggleSpoilerText() {
    if(this.spoilerFieldState == 'hidden'){
      this.spoilerFieldState = 'visible'
    } else {
      this.spoilerFieldState = 'hidden'
    }
    Keyboard.disableScroll(true);
  }
  

  countTootLength(){
    let spoilerTextLength = 0;
    if(this.newToot.spoiler_text) {
      spoilerTextLength = this.newToot.spoiler_text.length;
    }  
    this.remainingCharacters = 500 - this.newToot.status.length - spoilerTextLength;
    console.log(this.remainingCharacters);
  }
  



}
