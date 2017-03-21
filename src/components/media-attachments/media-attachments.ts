import { Platform } from 'ionic-angular';
import { ImageSliderPage } from '../../pages/image-slider/image-slider';
import { ModalController } from 'ionic-angular/components/modal/modal';
import { MediaAttachment } from '../../apiClasses/media-attachment';
import { Component, ElementRef, Input } from '@angular/core';

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

  mediaClassName = ["first", "second", "third", "fourth"]

  divClassName = ["singleMedia", "two", "three", "four"]

  isiOS: boolean;

  constructor(public modalController: ModalController,private elRef: ElementRef, public platform: Platform) {
    this.isiOS = this.platform.is('ios');
  }

  ngAfterViewInit(){
    let elements = this.elRef.nativeElement.querySelectorAll('video');
    for(let index = 0; index < elements.length; index++){
      elements[index].addEventListener('click', (event) => {
        let video = event.target;
        if(video.paused){
          video.play();
        } else {
          video.pause();
        }
      }); 
    }
  }

  toggleWarning(){
    console.log('toggling warning')
    this.hideWarning = !this.hideWarning;
  }

  showSlideshowFrom(index: number){
    console.log('show slides is called')
    console.log('warning already gone')
    let myModal = this.modalController.create(ImageSliderPage, { 'mediaAttachments' : this.mediaAttachments, 'slideFromNumber': index});
    myModal.present();
  }



}
