import { ModalController } from 'ionic-angular';
import { MediaAttachment } from '../../apiClasses/media-attachment';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
@Component({
  selector: 'page-image-slider',
  templateUrl: 'image-slider.html'
})
export class ImageSliderPage {

  mediaAttachments: MediaAttachment[];
  slideFromNumber: number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public modalController: ModalController) {
      this.mediaAttachments = navParams.get('mediaAttachments');
      this.slideFromNumber = navParams.get('slideFromNumber');
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageSliderPage');
  }


  dismiss(){
      this.viewCtrl.dismiss();
  }
}
