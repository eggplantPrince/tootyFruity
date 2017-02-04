import { HomePage } from '../home/home';
import { animate, Component, Input, state, style, transition, trigger } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { TootForm } from '../../apiClasses/tootForm'
import { Keyboard } from 'ionic-native';
import { APIProvider } from '../../providers/APIProvider';
/*
  Generated class for the TootForm component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'toot-form',
  templateUrl: 'toot-form.html'
})
export class TootFormComponent {

  @Input()
  newToot: TootForm;
  
  spoilerFieldState: string = 'hidden';
  spoilerToggle: Boolean;
  remainingCharacters: number = 500;

  constructor(public toaster: ToastController, public navCtrl: NavController, public navParams: NavParams, public mastodon: APIProvider, public viewCtrl: ViewController) {
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
    } else if(this.remainingCharacters < 0) {
      let toast = this.toaster.create({
        message: 'Wow! You used too many characters, try shortening it down',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    } 
    else {
      console.log('posting new toot...')
      if(!this.spoilerToggle){
        this.newToot.spoiler_text = null;
      }
      if(this.navCtrl.parent) {
        this.navCtrl.parent.select(0);
      } else {
        this.viewCtrl.dismiss();
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
    let spoilerTextLength = 0;
    if(this.newToot.spoiler_text) {
      spoilerTextLength = this.newToot.spoiler_text.length;
    }  
    this.remainingCharacters = 500 - this.newToot.status.length - spoilerTextLength;
    console.log(this.remainingCharacters);
  }

}
