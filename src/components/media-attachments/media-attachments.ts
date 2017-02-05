import { ImageSliderPage } from '../../pages/image-slider/image-slider';
import { ModalController } from 'ionic-angular/components/modal/modal';
import { MediaAttachment } from '../../apiClasses/media-attachment';
import { Component, Input } from '@angular/core';

/*
  Generated class for the MediaAttachments component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'media-attachments',
  templateUrl: 'media-attachments.html',
  entryComponents: [ImageSliderPage]
})
export class MediaAttachmentsComponent {

  @Input()
  public mediaAttachments: MediaAttachment[];

  @Input()
  mediaIsSensitive: boolean;

  hideWarning = false;

  hideSlides = true;

  constructor(public modalController: ModalController) {
  }

  toggleWarning(){
    console.log('toggling warning')
    this.hideWarning = !this.hideWarning;
  }

  showSlideShowFrom(index: number){
    console.log('show slides is called')
    console.log('warning already gone')
    let myModal = this.modalController.create(ImageSliderPage, { 'mediaAttachments' : this.mediaAttachments, 'slideFromNumber': index});
    myModal.present();
  }



}
