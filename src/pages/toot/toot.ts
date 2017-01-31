import { HomePage } from '../home/home';
import { animate, Component, state, style, transition, trigger } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { TootForm } from '../../apiClasses/tootForm'
import { Keyboard } from 'ionic-native';
import { APIProvider } from '../../providers/APIProvider';

/*
  Generated class for the Toot page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-toot',
  templateUrl: 'toot.html',
  providers: [APIProvider]
})

export class TootPage {

  newToot: TootForm;
  spoilerFieldState: string = 'hidden';
  spoilerToggle: Boolean;
  remainingCharacters: string= "500";

  constructor(public toaster: ToastController, public navCtrl: NavController, public navParams: NavParams, public mastodon: APIProvider) {
    Keyboard.disableScroll(true);
    this.newToot = new TootForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TootPage');
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
          this.navCtrl.parent.select(0);
        toast.present();  
        },
        error => console.log(JSON.stringify(error))
      );
      localStorage.setItem('lastVisibility', this.newToot.visibility);

    }
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
    this.remainingCharacters = 500 - this.newToot.status.length + "";
    console.log(this.remainingCharacters);
  }
  
}
