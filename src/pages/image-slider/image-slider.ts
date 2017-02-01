import { ModalController } from 'ionic-angular/components/modal/modal';
import { MediaAttachment } from '../../apiClasses/media-attachment';
import { Component, ViewChild } from '@angular/core';
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
